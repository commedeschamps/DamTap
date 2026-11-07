package kz.damtap.backend;

import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.List;

public final class ApiModels {
    private ApiModels() {}

    public record OfferInput(
            @NotBlank @Size(max = 160) String title,
            @NotBlank @Size(max = 120) String venue,
            @NotNull @Pattern(regexp = "ready|bakery|fruits|dairy|meat|groceries|drinks") String category,
            @NotBlank @Size(max = 100) String district,
            @NotBlank @Size(max = 240) String address,
            @NotNull @Pattern(regexp = "/images/[a-zA-Z0-9._-]+\\.(webp|png|jpe?g)") String image,
            @NotNull @DecimalMin("0") @DecimalMax("1000") Double distanceKm,
            @NotNull @Min(1) @Max(1_000_000) Integer price,
            @NotNull @Min(1) @Max(1_000_000) Integer oldPrice,
            @NotNull Instant endsAt,
            @NotNull Instant pickupStartsAt,
            @NotBlank @Size(max = 1000) String pickupInstructions,
            @NotNull @Min(0) @Max(10000) Integer quantityLeft,
            @NotNull @Size(max = 20) List<@NotBlank @Size(max = 80) String> allergens
    ) {}

    // Field names and string IDs match data/offers.ts in the existing frontend.
    public record OfferView(
            String id, String title, String venue, String category, String district,
            String address, String image, double distanceKm, int price, int oldPrice,
            Instant endsAt, Instant pickupStartsAt, String pickupInstructions,
            int quantityLeft, List<String> allergens
    ) {
        static OfferView from(Offer offer) {
            return new OfferView(offer.id, offer.title, offer.venue, offer.category,
                    offer.district, offer.address, offer.image, offer.distanceKm,
                    offer.price, offer.oldPrice, offer.endsAt, offer.pickupStartsAt,
                    offer.pickupInstructions, offer.quantityLeft, List.copyOf(offer.allergens));
        }
    }

    public record ReservationInput(
            @NotBlank @Size(max = 36) String offerId,
            @NotNull @Min(1) @Max(10) Integer quantity
    ) {}

    public record ReservationView(
            String id, String offerId, String title, String venue, String address,
            int quantity, int unitPrice, int totalPrice, int quantityLeft,
            Instant pickupStartsAt, Instant endsAt, Instant createdAt
    ) {
        static ReservationView from(Reservation reservation) {
            Offer offer = reservation.offer;
            return new ReservationView(reservation.id.toString(), offer.id,
                    offer.title, offer.venue, offer.address, reservation.quantity,
                    reservation.unitPrice, reservation.quantity * reservation.unitPrice,
                    offer.quantityLeft, offer.pickupStartsAt, offer.endsAt, reservation.createdAt);
        }
    }

    public record PartnerInput(
            @NotBlank @Size(max = 100) String venue,
            @NotBlank @Email @Size(max = 254) String email
    ) {}

    // Public acknowledgement deliberately contains no contact details.
    public record PartnerReceipt(String id, Instant createdAt) {}

    public record PartnerView(String id, String venue, String email, Instant createdAt) {
        static PartnerView from(PartnerApplication application) {
            return new PartnerView(application.id.toString(), application.venue,
                    application.email, application.createdAt);
        }
    }
}
