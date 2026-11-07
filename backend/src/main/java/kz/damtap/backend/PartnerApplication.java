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
    @Column(name = "email_key", length = 254, unique = true)
    String emailKey; // Nullable so existing rows need no destructive backfill.

    @Column(name = "applicant_id", length = 200, unique = true)
    String applicantId; // One application per verified identity; nullable for legacy rows.

    protected PartnerApplication() {}

    PartnerApplication(PartnerInput input, Instant now, String applicantId) {
        id = UUID.randomUUID();
        this.applicantId = applicantId;
        venue = input.venue().strip();
        email = input.email().strip().toLowerCase(Locale.ROOT);
        emailKey = email;
        createdAt = now;
    }
}
