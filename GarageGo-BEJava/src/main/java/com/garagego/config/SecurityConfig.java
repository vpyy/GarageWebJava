package com.garagego.config;

import com.garagego.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity          // bật @PreAuthorize / @Secured nếu cần sau này
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    // ─────────────────────────────────────────────────────────────────
    // Security Filter Chain
    // ─────────────────────────────────────────────────────────────────

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            .authorizeHttpRequests(auth -> auth
                // CORS preflight — phải permit trước tất cả
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Swagger — public
                .requestMatchers(
                    "/swagger-ui/**", "/swagger-ui.html",
                    "/v3/api-docs/**", "/v3/api-docs"
                ).permitAll()

                // Auth endpoints — public
                .requestMatchers(HttpMethod.POST,
                    "/api/auth/login",
                    "/api/auth/register",
                    "/api/auth/refresh"
                ).permitAll()

                // Xem sản phẩm / dịch vụ — public
                .requestMatchers(HttpMethod.GET,
                    "/api/san-pham/**", "/api/dich-vu/**"
                ).permitAll()

                // Gửi liên hệ — public
                .requestMatchers(HttpMethod.POST, "/api/lien-he/**").permitAll()

                // Thống kê — chỉ ADMIN
                .requestMatchers("/api/thong-ke/**").hasRole("ADMIN")

                // CRUD sản phẩm, dịch vụ — chỉ ADMIN
                .requestMatchers(HttpMethod.POST, "/api/san-pham/**", "/api/dich-vu/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/san-pham/**", "/api/dich-vu/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/san-pham/**", "/api/dich-vu/**").hasRole("ADMIN")

                // Yêu cầu dịch vụ — ADMIN và CUSTOMER
                .requestMatchers(HttpMethod.POST, "/api/yeu-cau/**").hasAnyRole("ADMIN", "CUSTOMER")
                .requestMatchers(HttpMethod.GET, "/api/yeu-cau/**").hasAnyRole("ADMIN", "CUSTOMER")
                .requestMatchers(HttpMethod.PUT, "/api/yeu-cau/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/yeu-cau/**").hasRole("ADMIN")

                // Khách hàng — ADMIN và CUSTOMER (customer chỉ xem của mình)
                .requestMatchers(HttpMethod.GET, "/api/khach-hang/**").hasAnyRole("ADMIN", "CUSTOMER")
                .requestMatchers(HttpMethod.POST, "/api/khach-hang/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/khach-hang/**").hasAnyRole("ADMIN", "CUSTOMER")
                .requestMatchers(HttpMethod.DELETE, "/api/khach-hang/**").hasRole("ADMIN")

                // Xe — ADMIN và CUSTOMER (customer chỉ xem xe của mình)
                .requestMatchers(HttpMethod.GET, "/api/xe/**").hasAnyRole("ADMIN", "CUSTOMER")
                .requestMatchers(HttpMethod.POST, "/api/xe/**").hasAnyRole("ADMIN", "CUSTOMER")
                .requestMatchers(HttpMethod.PUT, "/api/xe/**").hasAnyRole("ADMIN", "CUSTOMER")
                .requestMatchers(HttpMethod.DELETE, "/api/xe/**").hasAnyRole("ADMIN", "CUSTOMER")

                // Đơn hàng — ADMIN và CUSTOMER
                .requestMatchers(HttpMethod.GET, "/api/don-hang/**").hasAnyRole("ADMIN", "CUSTOMER")
                .requestMatchers(HttpMethod.POST, "/api/don-hang/**").hasAnyRole("ADMIN", "CUSTOMER")
                .requestMatchers(HttpMethod.PUT, "/api/don-hang/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/don-hang/**").hasRole("ADMIN")

                // Hóa đơn — ADMIN và CUSTOMER
                .requestMatchers(HttpMethod.GET, "/api/hoa-don/**").hasAnyRole("ADMIN", "CUSTOMER")
                .requestMatchers(HttpMethod.POST, "/api/hoa-don/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/hoa-don/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/hoa-don/**").hasRole("ADMIN")

                // Liên hệ — ADMIN xem tất cả
                .requestMatchers(HttpMethod.GET, "/api/lien-he/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/lien-he/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/lien-he/**").hasRole("ADMIN")

                // Còn lại — cần đăng nhập
                .anyRequest().authenticated()
            )

            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5102"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // ─────────────────────────────────────────────────────────────────
    // Beans
    // ─────────────────────────────────────────────────────────────────

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
