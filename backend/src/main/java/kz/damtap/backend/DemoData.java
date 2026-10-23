package kz.damtap.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.InputStream;
import java.time.Clock;
import java.time.Instant;
import kz.damtap.backend.ApiModels.OfferInput;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnProperty(name = "app.seed-demo", havingValue = "true", matchIfMissing = true)
class DemoData implements ApplicationRunner {
    private final OfferRepository offers;
    private final ObjectMapper mapper;
    private final Clock clock;

    DemoData(OfferRepository offers, ObjectMapper mapper, Clock clock) {
        this.offers = offers;
        this.mapper = mapper;
        this.clock = clock;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments arguments) throws Exception {
        // Seed once; restarting must never replenish stock or move expiry dates.
        if (offers.count() != 0) return;
        Instant now = clock.instant();
        try (InputStream stream = getClass().getResourceAsStream("/demo-offers.json")) {
            if (stream == null) throw new IllegalStateException("Missing demo-offers.json");
            for (JsonNode item : mapper.readTree(stream)) {
                ObjectNode node = (ObjectNode) item;
                String id = node.remove("id").asText();
                double hours = node.remove("durationHours").asDouble();
                node.put("pickupStartsAt", now.plusSeconds(15 * 60).toString());
                node.put("endsAt", now.plusSeconds((long) (hours * 3600)).toString());
                offers.save(new Offer(id, mapper.treeToValue(node, OfferInput.class), now));
            }
        }
    }
}
