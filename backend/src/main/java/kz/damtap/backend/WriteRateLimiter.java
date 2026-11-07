package kz.damtap.backend;

import java.time.Clock;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Component;

/** Bounded, per-process admission control. Client-supplied forwarding headers are not trusted. */
@Component
class WriteRateLimiter {
    private record Window(long minute, int count) {}
    private final Map<String, Window> windows = new HashMap<>();
    private final Clock clock;
    WriteRateLimiter(Clock clock) { this.clock = clock; }

    synchronized boolean allow(String key, int limit) {
        long minute = clock.instant().getEpochSecond() / 60;
        Window old = windows.get(key);
        if (old != null && old.minute == minute) {
            if (old.count >= limit) return false;
            windows.put(key, new Window(minute, old.count + 1));
            return true;
        }
        if (windows.size() >= 10_000) {
            windows.entrySet().removeIf(entry -> entry.getValue().minute != minute);
            if (windows.size() >= 10_000) return false;
        }
        windows.put(key, new Window(minute, 1));
        return true;
    }
}
