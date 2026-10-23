package kz.damtap.backend;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import kz.damtap.backend.ApiModels.OfferInput;

@Entity
@Table(name = "offers")
class Offer {
    @Id @Column(length = 36)
    String id;
    @Column(nullable = false, length = 160)
    String title;
    @Column(nullable = false, length = 120)
    String venue;
    @Column(nullable = false, length = 20)
    String category;
    @Column(nullable = false, length = 100)
    String district;
    @Column(nullable = false, length = 240)
    String address;
    @Column(nullable = false)
    String image;
    double distanceKm;
    int price;
    int oldPrice;
    @Column(nullable = false)
    Instant endsAt;
    @Column(nullable = false)
    Instant pickupStartsAt;
    @Column(nullable = false, length = 1000)
    String pickupInstructions;
    int quantityLeft;
    @Column(nullable = false)
    Instant createdAt;

    @ElementCollection
    @CollectionTable(name = "offer_allergens", joinColumns = @JoinColumn(name = "offer_id"))
    @OrderColumn(name = "allergen_order")
    @Column(name = "allergen", nullable = false, length = 80)
    List<String> allergens = new ArrayList<>();

    protected Offer() {}

    Offer(String id, OfferInput input, Instant now) {
        this.id = id;
        title = input.title().strip();
        venue = input.venue().strip();
        category = input.category();
        district = input.district().strip();
        address = input.address().strip();
        image = input.image();
        distanceKm = input.distanceKm();
        price = input.price();
        oldPrice = input.oldPrice();
        endsAt = input.endsAt();
        pickupStartsAt = input.pickupStartsAt();
        pickupInstructions = input.pickupInstructions().strip();
        quantityLeft = input.quantityLeft();
        allergens = new ArrayList<>(input.allergens());
        createdAt = now;
    }
}
