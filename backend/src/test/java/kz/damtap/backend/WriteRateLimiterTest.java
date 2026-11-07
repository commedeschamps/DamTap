package kz.damtap.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.*;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import static org.assertj.core.api.Assertions.assertThat;

class WriteRateLimiterTest {
    static class MutableClock extends Clock {
        Instant now = Instant.parse("2026-11-07T00:00:00Z");
        public ZoneId getZone() { return ZoneOffset.UTC; }
        public Clock withZone(ZoneId zone) { return this; }
        public Instant instant() { return now; }
    }

    @Test void limitsExpireAndDifferentClientsHaveSeparateQuotas() {
        MutableClock clock = new MutableClock();
        WriteRateLimiter limiter = new WriteRateLimiter(clock);
        assertThat(limiter.allow("a", 2)).isTrue();
        assertThat(limiter.allow("a", 2)).isTrue();
        assertThat(limiter.allow("a", 2)).isFalse();
        assertThat(limiter.allow("b", 2)).isTrue();
        clock.now = clock.now.plusSeconds(60);
        assertThat(limiter.allow("a", 2)).isTrue();
    }

    @Test void identityCacheIsBoundedAndExpiredEntriesAreReclaimed() {
        MutableClock clock = new MutableClock();
        WriteRateLimiter limiter = new WriteRateLimiter(clock);
        for (int i = 0; i < 10_000; i++) assertThat(limiter.allow("client-" + i, 2)).isTrue();
        assertThat(limiter.allow("new-client", 2)).isFalse();
        clock.now = clock.now.plusSeconds(60);
        assertThat(limiter.allow("new-client", 2)).isTrue();
    }

    @Test void forwardedHeadersCannotResetThePeerQuota() throws Exception {
        var guard = new ApiRequestGuard(new AdminAccess("key"), new WriteRateLimiter(new MutableClock()),
                new ObjectMapper(), 2, 100);
        AtomicInteger admitted = new AtomicInteger();
        for (int i = 0; i < 3; i++) {
            var request = new MockHttpServletRequest("POST", "/api/partner-applications");
            request.setRemoteAddr("192.0.2.1");
            request.addHeader("X-Forwarded-For", "198.51.100." + i);
            request.addHeader("Forwarded", "for=198.51.100." + i);
            request.setContentType("application/json");
            request.setContent("{}".getBytes());
            var response = new MockHttpServletResponse();
            guard.doFilter(request, response, (req, res) -> admitted.incrementAndGet());
            assertThat(response.getStatus()).isEqualTo(i < 2 ? 200 : 429);
            if (i == 2) assertThat(response.getHeader("Retry-After")).isEqualTo("60");
        }
        assertThat(admitted.get()).isEqualTo(2);
    }
}
