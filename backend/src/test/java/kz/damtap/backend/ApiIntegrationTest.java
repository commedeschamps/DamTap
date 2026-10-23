package kz.damtap.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:damtap-tests;DB_CLOSE_DELAY=-1;LOCK_TIMEOUT=10000",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "app.seed-demo=false",
        "app.admin-key=local-integration-test-key"
})
@AutoConfigureMockMvc
class ApiIntegrationTest {
    private static final String KEY = "local-integration-test-key";
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired OfferRepository offers;
    @Autowired ReservationRepository reservations;
    @Autowired PartnerApplicationRepository partners;

    @BeforeEach
    void reset() {
        reservations.deleteAll();
        partners.deleteAll();
        offers.deleteAll();
    }

    @Test
    void catalogMatchesFrontendAndFiltersSearchCategoryAndPrice() throws Exception {
        String first = createOffer("Круассан", "bakery", 750, 3);
        createOffer("Боул", "ready", 1200, 4);
        mvc.perform(get("/api/offers").param("q", "ДОСТЫК").param("category", "bakery"))
                .andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(first))
                .andExpect(jsonPath("$[0].price").value(750))
                .andExpect(jsonPath("$[0].quantityLeft").value(3))
                .andExpect(jsonPath("$[0].pickupStartsAt").isString())
                .andExpect(jsonPath("$[0].endsAt").isString())
                .andExpect(jsonPath("$[0].allergens[0]").value("Глютен"));
        mvc.perform(get("/api/offers").param("sort", "price"))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].price").value(750));
        mvc.perform(get("/api/offers/" + first))
                .andExpect(status().isOk()).andExpect(jsonPath("$.id").value(first));
    }

    @Test
    void soldOutAndExpiredOffersAreExcludedFromCatalog() throws Exception {
        createOffer("Sold out", "bakery", 750, 0);
        String expiredId = createOffer("Expired", "bakery", 750, 3);
        Offer expired = offers.findById(expiredId).orElseThrow();
        expired.endsAt = Instant.now().minusSeconds(60);
        offers.saveAndFlush(expired);
        mvc.perform(get("/api/offers")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(0)));
        mvc.perform(post("/api/reservations").contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("offerId", expiredId, "quantity", 1))))
                .andExpect(status().isConflict());
        assertThat(reservations.count()).isZero();
    }

    @Test
    void reservationUsesServerPriceAndPersistsRemainingStock() throws Exception {
        String offerId = createOffer("Круассан", "bakery", 750, 3);
        String body = mvc.perform(post("/api/reservations").contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("offerId", offerId, "quantity", 2))))
                .andExpect(status().isCreated()).andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.totalPrice").value(1500))
                .andExpect(jsonPath("$.quantityLeft").value(1))
                .andReturn().getResponse().getContentAsString();
        String id = mapper.readTree(body).get("id").asText();
        mvc.perform(get("/api/reservations/" + id)).andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(2))
                .andExpect(jsonPath("$.unitPrice").value(750));
        assertThat(offers.findById(offerId).orElseThrow().quantityLeft).isEqualTo(1);
        assertThat(reservations.count()).isEqualTo(1);
    }

    @Test
    void insufficientStockDoesNotCreateReservationOrDecrementStock() throws Exception {
        String offerId = createOffer("Круассан", "bakery", 750, 1);
        mvc.perform(post("/api/reservations").contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("offerId", offerId, "quantity", 2))))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.detail").isString());
        assertThat(offers.findById(offerId).orElseThrow().quantityLeft).isEqualTo(1);
        assertThat(reservations.count()).isZero();
    }

    @Test
    void lastPortionCanOnlyBeReservedOnceAcrossConcurrentRequests() throws Exception {
        String offerId = createOffer("Последняя порция", "ready", 1000, 1);
        String json = mapper.writeValueAsString(Map.of("offerId", offerId, "quantity", 1));
        CountDownLatch start = new CountDownLatch(1);
        ExecutorService executor = Executors.newFixedThreadPool(2);
        try {
            java.util.concurrent.Callable<Integer> attempt = () -> {
                assertThat(start.await(5, TimeUnit.SECONDS)).isTrue();
                return mvc.perform(post("/api/reservations").contentType(MediaType.APPLICATION_JSON)
                        .content(json)).andReturn().getResponse().getStatus();
            };
            Future<Integer> first = executor.submit(attempt);
            Future<Integer> second = executor.submit(attempt);
            start.countDown();
            assertThat(List.of(first.get(15, TimeUnit.SECONDS), second.get(15, TimeUnit.SECONDS)))
                    .containsExactlyInAnyOrder(201, 409);
        } finally {
            executor.shutdownNow();
        }
        assertThat(offers.findById(offerId).orElseThrow().quantityLeft).isZero();
        assertThat(reservations.count()).isEqualTo(1);
    }

    @Test
    void partnerContactsPersistAndOnlyAdminCanReadThem() throws Exception {
        mvc.perform(post("/api/partner-applications").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"venue\":\"Новая пекарня\",\"email\":\"owner@example.kz\"}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.id").isString())
                .andExpect(jsonPath("$.email").doesNotExist());
        mvc.perform(get("/api/admin/partner-applications")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/partner-applications").header("X-Admin-Key", "wrong"))
                .andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/partner-applications").header("X-Admin-Key", KEY))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].email").value("owner@example.kz"));
        assertThat(partners.count()).isEqualTo(1);
    }

    @Test
    void invalidInputUnknownFieldsAndMissingResourcesReturnClientErrors() throws Exception {
        mvc.perform(post("/api/reservations").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"offerId\":\"1\",\"quantity\":0}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.quantity").exists());
        mvc.perform(post("/api/reservations").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"offerId\":\"1\",\"quantity\":1,\"price\":1}"))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/api/partner-applications").contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("venue", " ", "email", "invalid"))))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/offers/missing")).andExpect(status().isNotFound());
        mvc.perform(get("/api/reservations/not-a-uuid")).andExpect(status().isBadRequest());
        mvc.perform(get("/api/offers").param("category", "unknown")).andExpect(status().isBadRequest());
        mvc.perform(get("/api/offers").param("sort", "unknown")).andExpect(status().isBadRequest());
        mvc.perform(get("/api/offers").param("q", "a".repeat(201))).andExpect(status().isBadRequest());
    }

    @Test
    void offerCreationRequiresAdminKeyAndConsistentPriceAndDates() throws Exception {
        var input = offerInput("Тест", "ready", 1000, 1);
        mvc.perform(post("/api/admin/offers").contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(input)))
                .andExpect(status().isUnauthorized());
        var invalidPrice = mapper.valueToTree(input);
        ((com.fasterxml.jackson.databind.node.ObjectNode) invalidPrice).put("oldPrice", 1);
        mvc.perform(post("/api/admin/offers").header("X-Admin-Key", KEY)
                        .contentType(MediaType.APPLICATION_JSON).content(invalidPrice.toString()))
                .andExpect(status().isBadRequest());
        var invalidDates = mapper.valueToTree(input);
        ((com.fasterxml.jackson.databind.node.ObjectNode) invalidDates).put("endsAt", Instant.now().minusSeconds(1).toString());
        mvc.perform(post("/api/admin/offers").header("X-Admin-Key", KEY)
                        .contentType(MediaType.APPLICATION_JSON).content(invalidDates.toString()))
                .andExpect(status().isBadRequest());
        assertThat(offers.count()).isZero();
    }

    private String createOffer(String title, String category, int price, int quantity) throws Exception {
        String response = mvc.perform(post("/api/admin/offers").header("X-Admin-Key", KEY)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(offerInput(title, category, price, quantity))))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        JsonNode json = mapper.readTree(response);
        return json.get("id").asText();
    }

    private ApiModels.OfferInput offerInput(String title, String category, int price, int quantity) {
        return new ApiModels.OfferInput(title, "Пекарня Le Pain", category, "Есильский район",
                "ул. Достык, 5", "/images/food-1.webp", 0.8, price, price * 2,
                Instant.now().plusSeconds(7200), Instant.now().plusSeconds(900),
                "Забрать у кассы", quantity, List.of("Глютен"));
    }
}
