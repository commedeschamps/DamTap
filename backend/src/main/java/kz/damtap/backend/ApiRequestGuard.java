package kz.damtap.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
class ApiRequestGuard extends OncePerRequestFilter {
    private static final int BODY_LIMIT = 16 * 1024;
    private final AdminAccess admin;
    private final WriteRateLimiter limiter;
    private final ObjectMapper mapper;
    private final int publicLimit;
    private final int globalLimit;

    ApiRequestGuard(AdminAccess admin, WriteRateLimiter limiter, ObjectMapper mapper,
            @Value("${app.public-write-limit-per-minute:30}") int publicLimit,
            @Value("${app.global-write-limit-per-minute:300}") int globalLimit) {
        if (publicLimit < 1 || globalLimit < 1) {
            throw new IllegalArgumentException("Write limits must be positive");
        }
        this.admin = admin;
        this.limiter = limiter;
        this.mapper = mapper;
        this.publicLimit = publicLimit;
        this.globalLimit = globalLimit;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String path = request.getServletPath();
        // MockMvc may leave servletPath empty; requestURI is safe under the default context path.
        if (path.isEmpty()) path = request.getRequestURI().substring(request.getContextPath().length());
        if (!path.startsWith("/api/")) { chain.doFilter(request, response); return; }
        if (path.startsWith("/api/admin/")) {
            if (!limiter.allow("admin:" + request.getRemoteAddr(), 120)) {
                reject(response, HttpStatus.TOO_MANY_REQUESTS, "Слишком много запросов."); return;
            }
            try { admin.require(request.getHeader("X-Admin-Key")); }
            catch (ResponseStatusException exception) {
                reject(response, HttpStatus.valueOf(exception.getStatusCode().value()), exception.getReason()); return;
            }
        }
        boolean write = request.getMethod().equals("POST") || request.getMethod().equals("PUT")
                || request.getMethod().equals("PATCH");
        if (!write) { chain.doFilter(request, response); return; }
        if (!path.startsWith("/api/admin/") &&
                (!limiter.allow("write:" + request.getRemoteAddr(), publicLimit)
                        || !limiter.allow("global-writes", globalLimit))) {
            reject(response, HttpStatus.TOO_MANY_REQUESTS, "Слишком много запросов. Повторите через минуту."); return;
        }
        if (request.getContentLengthLong() > BODY_LIMIT) {
            reject(response, HttpStatus.PAYLOAD_TOO_LARGE, "Тело запроса превышает 16 КиБ."); return;
        }
        // Reading at most LIMIT+1 also bounds chunked requests and misleading/missing length headers.
        byte[] body = request.getInputStream().readNBytes(BODY_LIMIT + 1);
        if (body.length > BODY_LIMIT) {
            reject(response, HttpStatus.PAYLOAD_TOO_LARGE, "Тело запроса превышает 16 КиБ."); return;
        }
        chain.doFilter(new BufferedRequest(request, body), response);
    }

    private void reject(HttpServletResponse response, HttpStatus status, String detail) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/problem+json;charset=UTF-8");
        if (status == HttpStatus.TOO_MANY_REQUESTS) response.setHeader("Retry-After", "60");
        mapper.writeValue(response.getOutputStream(), Map.of("status", status.value(), "detail", detail));
    }

    private static final class BufferedRequest extends HttpServletRequestWrapper {
        private final byte[] body;
        BufferedRequest(HttpServletRequest request, byte[] body) { super(request); this.body = body; }
        @Override public int getContentLength() { return body.length; }
        @Override public long getContentLengthLong() { return body.length; }
        @Override public ServletInputStream getInputStream() {
            ByteArrayInputStream input = new ByteArrayInputStream(body);
            return new ServletInputStream() {
                @Override public int read() { return input.read(); }
                @Override public int read(byte[] bytes, int offset, int length) { return input.read(bytes, offset, length); }
                @Override public boolean isFinished() { return input.available() == 0; }
                @Override public boolean isReady() { return true; }
                @Override public void setReadListener(ReadListener listener) {
                    throw new UnsupportedOperationException("Blocking JSON request body");
                }
            };
        }
        @Override public BufferedReader getReader() {
            return new BufferedReader(new InputStreamReader(getInputStream(), StandardCharsets.UTF_8));
        }
    }
}
