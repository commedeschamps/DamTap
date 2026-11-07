package kz.damtap.backend;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
class CustomerSecurity {
    @Bean
    SecurityFilterChain apiSecurity(HttpSecurity http, ObjectProvider<JwtDecoder> providedDecoder,
            @Value("${app.customer-jwt-issuer:}") String issuer,
            @Value("${app.customer-jwt-audience:}") String audience) throws Exception {
        JwtDecoder decoder = providedDecoder.getIfAvailable();
        if (decoder == null && !issuer.isBlank() && !audience.isBlank()) {
            if (!issuer.startsWith("https://")) {
                throw new IllegalArgumentException("CUSTOMER_JWT_ISSUER must use HTTPS");
            }
            NimbusJwtDecoder trusted = JwtDecoders.fromIssuerLocation(issuer);
            trusted.setJwtValidator(validators(issuer, audience));
            decoder = trusted;
        }
        boolean configured = decoder != null;
        JwtDecoder verifiedDecoder = configured ? decoder : token -> {
            throw new BadJwtException("Customer authentication is not configured");
        };
        http.csrf(csrf -> csrf.disable()) // Stateless bearer tokens, no cookie authentication.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .requestCache(cache -> cache.disable())
                .authorizeHttpRequests(access -> access
                        .requestMatchers("/api/reservations", "/api/reservations/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/partner-applications").authenticated()
                        .anyRequest().permitAll())
                .oauth2ResourceServer(oauth -> oauth.jwt(jwt -> jwt.decoder(verifiedDecoder))
                        .authenticationEntryPoint((request, response, exception) -> {
                            response.setStatus(configured ? 401 : 503);
                            response.setContentType("application/problem+json;charset=UTF-8");
                            response.getWriter().write(configured
                                    ? "{\"status\":401,\"detail\":\"Требуется действительный токен пользователя.\"}"
                                    : "{\"status\":503,\"detail\":\"Операция недоступна: авторизация пользователей не настроена.\"}");
                        }));
        return http.build();
    }
    static org.springframework.security.oauth2.core.OAuth2TokenValidator<Jwt> validators(String issuer, String audience) {
        return new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(issuer),
                new JwtClaimValidator<Object>("exp", expiry -> expiry != null),
                new JwtClaimValidator<java.util.List<String>>("aud", values -> values != null && values.contains(audience)),
                new JwtClaimValidator<String>("sub", subject -> subject != null && !subject.isBlank() && subject.length() <= 200));
    }

}
