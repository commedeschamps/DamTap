package kz.damtap.backend;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "reservations")
class Reservation {
    @Id
    UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "offer_id", nullable = false)
    Offer offer;
    int quantity;
    // Snapshot the server's price when the reservation is made (whole KZT).
    int unitPrice;
    @Column(nullable = false)
    Instant createdAt;

    protected Reservation() {}

    Reservation(Offer offer, int quantity, Instant now) {
        id = UUID.randomUUID();
        this.offer = offer;
        this.quantity = quantity;
        unitPrice = offer.price;
        createdAt = now;
    }
}
