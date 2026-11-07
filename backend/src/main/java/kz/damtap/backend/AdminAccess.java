package kz.damtap.backend;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
class AdminAccess {
    private final String key;

    AdminAccess(@Value("${app.admin-key:}") String key) {
        this.key = key;
    }

    void require(String supplied) {
        if (key.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Админ-API отключено: задайте ADMIN_API_KEY.");
        }
        if (supplied == null || !MessageDigest.isEqual(key.getBytes(StandardCharsets.UTF_8),
                supplied.getBytes(StandardCharsets.UTF_8))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный ключ администратора.");
        }
    }
}
