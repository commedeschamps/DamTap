package kz.damtap.backend;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;
import kz.damtap.backend.ApiModels.PartnerInput;

@Entity
@Table(name = "partner_applications")
class PartnerApplication {
    @Id
    UUID id;
    @Column(nullable = false, length = 100)
    String venue;
    @Column(nullable = false, length = 254)
    String email;
    @Column(nullable = false)
    Instant createdAt;

    protected PartnerApplication() {}

    PartnerApplication(PartnerInput input, Instant now) {
        id = UUID.randomUUID();
        venue = input.venue().strip();
        email = input.email().strip().toLowerCase(Locale.ROOT);
        createdAt = now;
    }
}
