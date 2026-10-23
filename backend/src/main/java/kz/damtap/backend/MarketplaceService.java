package kz.damtap.backend;

import java.time.Clock;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import kz.damtap.backend.ApiModels.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
class MarketplaceService {
    private static final Set<String> CATEGORIES = Set.of(
            "all", "ready", "bakery", "fruits", "dairy", "meat", "groceries", "drinks");
    private final OfferRepository offers;
    private final ReservationRepository reservations;
    private final PartnerApplicationRepository partners;
    private final Clock clock;

    MarketplaceService(OfferRepository offers, ReservationRepository reservations,
                       PartnerApplicationRepository partners, Clock clock) {
        this.offers = offers;
        this.reservations = reservations;
        this.partners = partners;
        this.clock = clock;
    }

    List<OfferView> offers(String query, String category, String sort) {
        if (!CATEGORIES.contains(category)) {
            throw error(HttpStatus.BAD_REQUEST, "Неизвестная категория.");
        }
        Comparator<Offer> comparator = switch (sort) {
            case "recommended" -> Comparator.comparing((Offer o) -> o.createdAt).thenComparing(o -> o.id);
            case "distance" -> Comparator.comparingDouble(o -> o.distanceKm);
            case "price" -> Comparator.comparingInt(o -> o.price);
            case "ending" -> Comparator.comparing(o -> o.endsAt);
            case "discount" -> Comparator.comparingDouble(o -> (double) o.price / o.oldPrice);
            default -> throw error(HttpStatus.BAD_REQUEST, "Неизвестная сортировка.");
        };
        String search = query.strip().toLowerCase(Locale.ROOT);
        return offers.findAvailable(clock.instant()).stream()
                .filter(o -> category.equals("all") || o.category.equals(category))
                .filter(o -> (o.title + " " + o.venue + " " + o.district + " " + o.address + " Астана")
                        .toLowerCase(Locale.ROOT).contains(search))
                .sorted(comparator)
                .map(OfferView::from).toList();
    }

    OfferView offer(String id) {
        return OfferView.from(offers.findById(id)
                .orElseThrow(() -> error(HttpStatus.NOT_FOUND, "Предложение не найдено.")));
    }

    @Transactional
    OfferView createOffer(OfferInput input) {
        if (input.oldPrice() < input.price()) {
            throw error(HttpStatus.BAD_REQUEST, "Старая цена не может быть ниже новой.");
        }
        if (!input.endsAt().isAfter(clock.instant()) || !input.pickupStartsAt().isBefore(input.endsAt())) {
            throw error(HttpStatus.BAD_REQUEST, "Проверьте начало и окончание выдачи.");
        }
        return OfferView.from(offers.save(new Offer(UUID.randomUUID().toString(), input, clock.instant())));
    }

    @Transactional
    ReservationView reserve(ReservationInput input) {
        // A database row lock serializes concurrent reservations of the same offer.
        Offer offer = offers.findForReservation(input.offerId())
                .orElseThrow(() -> error(HttpStatus.NOT_FOUND, "Предложение не найдено."));
        Instant now = clock.instant();
        if (!offer.endsAt.isAfter(now)) {
            throw error(HttpStatus.CONFLICT, "Срок предложения уже истёк.");
        }
        if (input.quantity() > offer.quantityLeft) {
            throw error(HttpStatus.CONFLICT, "Недостаточно порций. Обновите страницу.");
        }
        offer.quantityLeft -= input.quantity();
        return ReservationView.from(reservations.save(new Reservation(offer, input.quantity(), now)));
    }

    ReservationView reservation(UUID id) {
        return ReservationView.from(reservations.findById(id)
                .orElseThrow(() -> error(HttpStatus.NOT_FOUND, "Бронь не найдена.")));
    }

    @Transactional
    PartnerReceipt apply(PartnerInput input) {
        PartnerApplication application = partners.save(new PartnerApplication(input, clock.instant()));
        return new PartnerReceipt(application.id.toString(), application.createdAt);
    }

    List<PartnerView> partnerApplications() {
        return partners.findAllByOrderByCreatedAtDesc().stream().map(PartnerView::from).toList();
    }

    private static ResponseStatusException error(HttpStatus status, String message) {
        return new ResponseStatusException(status, message);
    }
}
