package com.cts.apigateway.config;

import com.cts.apigateway.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176",
                "http://localhost:5177",
                "http://localhost:9090" // for swagger-ui.html access
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Send a plain 401 (no WWW-Authenticate: Basic header) so browsers
                // don't pop the native sign-in dialog when a JWT is missing/invalid.
                .exceptionHandling(eh -> eh.authenticationEntryPoint((swe, e) -> {
                    swe.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return Mono.empty();
                }))
                .authorizeExchange(exchange -> exchange

                        // =============================================
                        // PUBLIC ENDPOINTS (no authentication required)
                        // =============================================
                        .pathMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/auth/register").permitAll()


                            // =============================================
                            // AUDIT LOG SERVICE (/api/audit-logs/**)
                            // - ADMIN only
                            // =============================================
                                .pathMatchers("/api/audit-logs/**")
                                .hasRole("ADMIN")
                        // =============================================
                    // ADVERTISER
                    // =============================================
                        .pathMatchers(HttpMethod.GET, "/api/advertisers/**")
                        .hasAnyRole("BRAND_ADVERTISER", "MEDIA_PLANNER", "FINANCE_EXECUTIVE", "ADMIN")
                        .pathMatchers("/api/advertisers/**")
                        .hasAnyRole("BRAND_ADVERTISER", "ADMIN")

                // =============================================
                // BRAND
                // =============================================
                        .pathMatchers(HttpMethod.GET, "/api/brands/**")
                        .hasAnyRole("BRAND_ADVERTISER", "MEDIA_PLANNER", "FINANCE_EXECUTIVE", "ADMIN")
                        .pathMatchers("/api/brands/**")
                        .hasAnyRole("BRAND_ADVERTISER", "ADMIN")

                // =============================================
                // CAMPAIGN BRIEF
                // =============================================
                        .pathMatchers(HttpMethod.GET, "/api/campaign-briefs/**")
                        .hasAnyRole("BRAND_ADVERTISER", "MEDIA_PLANNER", "FINANCE_EXECUTIVE", "ADMIN")
                        .pathMatchers(HttpMethod.POST,
                                "/api/campaign-briefs/*/decision",
                                "/api/campaign-briefs/*/activate")
                        .hasRole("ADMIN")
                        .pathMatchers("/api/campaign-briefs/**")
                        .hasAnyRole("BRAND_ADVERTISER", "ADMIN")

                    // =============================================
                    // TARGET AUDIENCE
                    // =============================================
                        .pathMatchers(HttpMethod.GET, "/api/target-audiences/**")
                        .hasAnyRole("BRAND_ADVERTISER", "MEDIA_PLANNER", "FINANCE_EXECUTIVE", "ADMIN")
                        .pathMatchers("/api/target-audiences/**")
                        .hasAnyRole("BRAND_ADVERTISER", "ADMIN")

                                // =============================================
                                // CREATIVE MODULE
                                // - CREATIVE_MANAGER, ADMIN
                                // =============================================
                                .pathMatchers(
                                        "/api/creative-assets/**",
                                        "/api/creative-approvals/**",
                                        "/api/asset-links/**"
                                )
                                .hasAnyRole("CREATIVE_MANAGER", "ADMIN")
                // =============================================
                // DELIVERY & PACING MODULES
                // - DELIVERY_PUBLISHER, ADMIN
                // =============================================
                    .pathMatchers(
                            "/api/delivery-records/**",
                            "/api/pacing-alerts/**"
                    )
                    .hasAnyRole("DELIVERY_PUBLISHER", "ADMIN")

                        // =============================================
                        // FINANCE / CLIENT BILLING MODULE
                        // - FINANCE_EXECUTIVE, ADMIN, BRAND_ADVERTISER
                        // =============================================
                                .pathMatchers("/api/invoices/**", "/api/client-invoices/**")
                                .hasAnyRole("FINANCE_EXECUTIVE", "ADMIN", "BRAND_ADVERTISER")

                        // =============================================
                        // PUBLISHER INVOICE MODULE
                        // - DELIVERY_PUBLISHER, FINANCE_EXECUTIVE, ADMIN
                        // =============================================
                                .pathMatchers("/api/publisher-invoices/**")
                                .hasAnyRole("DELIVERY_PUBLISHER", "FINANCE_EXECUTIVE", "ADMIN")

        // =============================================
        // MEDIA PLAN MODULE
        // - MEDIA_PLANNER, ADMIN
        // =============================================
            .pathMatchers(
                    "/api/media-plans/**",
                    "/api/line-items/**",
                    "/api/insertion-orders/**"
            )
            .hasAnyRole("MEDIA_PLANNER","DELIVERY_PUBLISHER","ADMIN")

        // =============================================
        // DELIVERY RECORD MODULE
        // - DELIVERY_PUBLISHER, MEDIA_PLANNER, ADMIN
        // =============================================
            .pathMatchers(
                    "/api/delivery-records/**"
            )
            .hasAnyRole("DELIVERY_PUBLISHER", "MEDIA_PLANNER", "ADMIN")

                // =============================================
                // Swagger API Docs - Publicly accessible
                // =============================================
                                .pathMatchers(
                                        "/swagger-ui.html",
                                        "/swagger-ui/**",
                                        "/v3/api-docs/**",
                                        "/*/v3/api-docs",
                                        "/webjars/**"
                                ).permitAll()

        // =============================================
        // PACING ALERT MODULE
        // - MEDIA_PLANNER, FINANCE_EXECUTIVE, ADMIN
        // =============================================
            .pathMatchers(
                    "/api/pacing-alerts/**"
            )
            .hasAnyRole("MEDIA_PLANNER", "FINANCE_EXECUTIVE", "ADMIN")

                        // =============================================
                        // NOTIFICATION MODULE
                        // - ALL AUTHENTICATED ROLES (accessible to every user type)
                        // =============================================
                                .pathMatchers(
                                        "/api/notifications/**"
                                )
                                .hasAnyRole("ADMIN", "FINANCE_EXECUTIVE", "BRAND_ADVERTISER", "DELIVERY_PUBLISHER", "CREATIVE_MANAGER", "MEDIA_PLANNER")


                        // =============================================
                        // ALL OTHER ENDPOINTS - must be authenticated
                        // =============================================
//                        .anyExchange().authenticated()
                        .anyExchange().permitAll()
                )
                // Add JWT filter before the authentication filter
                .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }
}
