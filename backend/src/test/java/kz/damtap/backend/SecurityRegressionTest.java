package kz.damtap.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.io.ByteArrayInputStream;
import java.net.URI;
import java.net.http.*;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.*;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.*;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
        "spring.datasource.url=jdbc:h2:mem:security-regression;DB_CLOSE_DELAY=-1;LOCK_TIMEOUT=10000",
        "spring.jpa.hibernate.ddl-auto=create-drop", "app.seed-demo=false", "app.admin-key=review-only-test-key",
        "app.public-write-limit-per-minute=1000", "app.global-write-limit-per-minute=1000"
})
@Import(SecurityRegressionTest.TestTokens.class)
class SecurityRegressionTest {
    static final byte[] SECRET = "test-only-secret-not-for-production-0123456789".getBytes();
    @TestConfiguration static class TestTokens {
        @Bean JwtDecoder decoder() {
            var decoder = NimbusJwtDecoder.withSecretKey(new SecretKeySpec(SECRET, "HmacSHA256"))
                    .macAlgorithm(MacAlgorithm.HS256).build();
            decoder.setJwtValidator(CustomerSecurity.validators("https://issuer.example.invalid", "damtap"));
            return decoder;
        }
    }
    @LocalServerPort int port;
    @Autowired ObjectMapper mapper;
    @Autowired OfferRepository offers;
    @Autowired ReservationRepository reservations;
    @Autowired PartnerApplicationRepository partners;
    HttpClient client = HttpClient.newBuilder().version(HttpClient.Version.HTTP_1_1).build();

    @BeforeEach void reset() { reservations.deleteAll(); partners.deleteAll(); offers.deleteAll(); }
    String token(String subject) { return token(subject, "damtap", "https://issuer.example.invalid", Instant.now().plusSeconds(600)); }
    String token(String subject, String audience, String issuer, Instant expiry) {
        var encoder = new NimbusJwtEncoder(new ImmutableSecret<>(SECRET));
        var claims = JwtClaimsSet.builder().issuer(issuer).subject(subject).audience(List.of(audience))
                .claim("email", "owner@example.invalid").claim("email_verified", true)
                .issuedAt(Instant.now().minusSeconds(3600)).expiresAt(expiry).build();
        return encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
    }
    HttpResponse<String> post(String path, String body, String token) throws Exception {
        var request = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api" + path))
                .header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(body));
        if (token != null) request.header("Authorization", "Bearer " + token);
        return client.send(request.build(), HttpResponse.BodyHandlers.ofString());
    }
    void seed(int count) {
        var input = new ApiModels.OfferInput("Test", "Test venue", "ready", "Test district", "Test address",
                "/images/food-1.webp", 0.1, 1000, 2000, Instant.now().plusSeconds(3600), Instant.now(), "Test", count, List.of());
        offers.saveAndFlush(new Offer("review-offer", input, Instant.now()));
    }

    @Test void unauthenticatedAndInvalidTokensCannotDecrementStock() throws Exception {
        seed(20);
        String body = "{\"offerId\":\"review-offer\",\"quantity\":1}";
        for (String invalid : List.of("not-a-jwt", token(" "), token("x".repeat(201)), token("alice", "wrong", "https://issuer.example.invalid", Instant.now().plusSeconds(600)),
                token("alice", "damtap", "https://wrong.example.invalid", Instant.now().plusSeconds(600)),
                token("alice", "damtap", "https://issuer.example.invalid", Instant.now().minusSeconds(120)))) {
            assertThat(post("/reservations", body, invalid).statusCode()).isEqualTo(401);
        }
        var forged = new NimbusJwtEncoder(new ImmutableSecret<>("different-test-only-secret-01234567890123456789".getBytes()))
                .encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),
                        JwtClaimsSet.builder().issuer("https://issuer.example.invalid").subject("alice")
                                .audience(List.of("damtap")).expiresAt(Instant.now().plusSeconds(600)).build())).getTokenValue();
        assertThat(post("/reservations", body, forged).statusCode()).isEqualTo(401);
        var noExpiry = new NimbusJwtEncoder(new ImmutableSecret<>(SECRET))
                .encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),
                        JwtClaimsSet.builder().issuer("https://issuer.example.invalid").subject("alice")
                                .audience(List.of("damtap")).build())).getTokenValue();
        assertThat(post("/reservations", body, noExpiry).statusCode()).isEqualTo(401);
        assertThat(post("/reservations", body, null).statusCode()).isEqualTo(401);
        assertThat(reservations.count()).isZero();
        assertThat(offers.findById("review-offer").orElseThrow().quantityLeft).isEqualTo(20);
    }

    @Test void replayCannotExceedCustomerPortionQuotaAndReceiptsAreOwnerOnly() throws Exception {
        seed(20);
        String body = "{\"offerId\":\"review-offer\",\"quantity\":2}";
        var created = post("/reservations", body, token("alice"));
        assertThat(created.statusCode()).isEqualTo(201);
        assertThat(post("/reservations", body, token("alice")).statusCode()).isEqualTo(429);
        assertThat(reservations.count()).isEqualTo(1);
        assertThat(offers.findById("review-offer").orElseThrow().quantityLeft).isEqualTo(18);
        String id = mapper.readTree(created.body()).get("id").asText();
        for (String subject : List.of("alice", "bob")) {
            var request = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api/reservations/" + id))
                    .header("Authorization", "Bearer " + token(subject)).GET().build();
            var receipt = client.send(request, HttpResponse.BodyHandlers.ofString());
            assertThat(receipt.statusCode()).isEqualTo(subject.equals("alice") ? 200 : 404);
            if (subject.equals("alice")) {
                assertThat(mapper.readTree(receipt.body()).get("offerId").asText()).isEqualTo("review-offer");
                assertThat(mapper.readTree(receipt.body()).get("title").asText()).isEqualTo("Test");
            }
        }
    }

    @Test void concurrentRequestsCannotRaceTheCustomerQuota() throws Exception {
        seed(20);
        String body = "{\"offerId\":\"review-offer\",\"quantity\":2}";
        String token = token("alice");
        var pool = Executors.newFixedThreadPool(2);
        var start = new CountDownLatch(1);
        try {
            Callable<Integer> request = () -> { start.await(); return post("/reservations", body, token).statusCode(); };
            var a = pool.submit(request); var b = pool.submit(request); start.countDown();
            assertThat(List.of(a.get(10, TimeUnit.SECONDS), b.get(10, TimeUnit.SECONDS))).containsExactlyInAnyOrder(201, 429);
            assertThat(reservations.count()).isEqualTo(1);
        } finally { pool.shutdownNow(); }
    }

    @Test void duplicatePartnerApplicationsAreIdempotentAndConcurrentDuplicatesAreBounded() throws Exception {
        String body = "{\"venue\":\"Test\",\"email\":\"OWNER@example.invalid\"}";
        var first = post("/partner-applications", body, token("applicant"));
        assertThat(first.statusCode()).isEqualTo(201);
        for (int i = 0; i < 20; i++) {
            var duplicate = post("/partner-applications", body.replace("OWNER", "owner"), token("applicant"));
            assertThat(duplicate.statusCode()).isEqualTo(201);
            assertThat(mapper.readTree(duplicate.body()).get("id")).isEqualTo(mapper.readTree(first.body()).get("id"));
        }
        assertThat(partners.count()).isEqualTo(1);
        partners.deleteAll();
        var pool = Executors.newFixedThreadPool(2);
        try {
            var a = pool.submit(() -> post("/partner-applications", body, token("applicant")).statusCode());
            var b = pool.submit(() -> post("/partner-applications", body, token("applicant")).statusCode());
            assertThat(List.of(a.get(10, TimeUnit.SECONDS), b.get(10, TimeUnit.SECONDS)))
                    .allMatch(status -> status == 201 || status == 409).contains(201);
            assertThat(partners.count()).isEqualTo(1);
        } finally { pool.shutdownNow(); }
    }

    @Test void partnerApplicationsRequireVerifiedEmailAndCannotUseOtherAddresses() throws Exception {
        String body = "{\"venue\":\"Test\",\"email\":\"owner@example.invalid\"}";
        assertThat(post("/partner-applications", body, null).statusCode()).isEqualTo(401);
        assertThat(post("/partner-applications", body.replace("owner@", "someone@"), token("applicant")).statusCode()).isEqualTo(403);
        var unverified = new NimbusJwtEncoder(new ImmutableSecret<>(SECRET))
                .encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),
                        JwtClaimsSet.builder().issuer("https://issuer.example.invalid").subject("applicant")
                                .audience(List.of("damtap")).claim("email", "owner@example.invalid")
                                .claim("email_verified", false).expiresAt(Instant.now().plusSeconds(600)).build())).getTokenValue();
        assertThat(post("/partner-applications", body, unverified).statusCode()).isEqualTo(403);
        assertThat(partners.count()).isZero();
    }

    @Test void oversizedContentLengthAndChunkedBodiesReturn413() throws Exception {
        String json = " ".repeat(3 * 1024 * 1024) + "{\"venue\":\"Test\",\"email\":\"owner@example.invalid\"}";
        assertThat(post("/partner-applications", json, null).statusCode()).isEqualTo(413);
        byte[] bytes = json.getBytes();
        var chunked = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api/partner-applications"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofInputStream(() -> new ByteArrayInputStream(bytes))).build();
        assertThat(client.send(chunked, HttpResponse.BodyHandlers.ofString()).statusCode()).isEqualTo(413);
        assertThat(partners.count()).isZero();
    }

    @Test void adminAuthenticationPrecedesJsonParsing() throws Exception {
        assertThat(post("/admin/offers", "not-json", null).statusCode()).isEqualTo(401);
        var authorized = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api/admin/offers"))
                .header("X-Admin-Key", "review-only-test-key").header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("not-json")).build();
        assertThat(client.send(authorized, HttpResponse.BodyHandlers.ofString()).statusCode()).isEqualTo(400);
    }
}
