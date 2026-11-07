package kz.damtap.backend;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import kz.damtap.backend.ApiModels.*;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Validated
class ApiController {
    private final MarketplaceService service;
    private final AdminAccess admin;

    ApiController(MarketplaceService service, AdminAccess admin) {
        this.service = service;
        this.admin = admin;
    }

    @GetMapping("/health")
    Map<String, String> health() {
        return Map.of("status", "UP");
    }

    @GetMapping("/offers")
    List<OfferView> offers(@RequestParam(defaultValue = "") @Size(max = 200) String q,
                           @RequestParam(defaultValue = "all") String category,
                           @RequestParam(defaultValue = "recommended") String sort) {
        return service.offers(q, category, sort);
    }

    @GetMapping("/offers/{id}")
    OfferView offer(@PathVariable String id) {
        return service.offer(id);
    }

    @PostMapping("/reservations")
    ResponseEntity<ReservationView> reserve(@Valid @RequestBody ReservationInput input) {
        ReservationView result = service.reserve(input);
        return ResponseEntity.created(URI.create("/api/reservations/" + result.id())).body(result);
    }

    @GetMapping("/reservations/{id}")
    ReservationView reservation(@PathVariable UUID id) {
        return service.reservation(id);
    }

    @PostMapping("/partner-applications")
    ResponseEntity<PartnerReceipt> apply(@Valid @RequestBody PartnerInput input) {
        return ResponseEntity.status(201).body(service.apply(input));
    }

    @PostMapping("/admin/offers")
    ResponseEntity<OfferView> createOffer(@Valid @RequestBody OfferInput input,
            @RequestHeader(value = "X-Admin-Key", required = false) String key) {
        admin.require(key);
        OfferView result = service.createOffer(input);
        return ResponseEntity.created(URI.create("/api/offers/" + result.id())).body(result);
    }

    @GetMapping("/admin/partner-applications")
    List<PartnerView> partnerApplications(@RequestHeader(value = "X-Admin-Key", required = false) String key) {
        admin.require(key);
        return service.partnerApplications();
    }
}
