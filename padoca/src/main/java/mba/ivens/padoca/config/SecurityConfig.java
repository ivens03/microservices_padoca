package mba.ivens.padoca.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // --- ROTAS PÚBLICAS ---
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/produtos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categorias").permitAll()

                        // Permitir envio de feedback por qualquer um (ou apenas autenticados, se preferir)
                        .requestMatchers(HttpMethod.POST, "/api/feedbacks").authenticated()

                        // --- ROTAS RESTRITAS ---
                        // Categorias e Produtos (Escrita)
                        .requestMatchers(HttpMethod.POST, "/api/categorias").hasAnyRole("GESTOR", "FUNCIONARIO", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasAnyRole("GESTOR", "FUNCIONARIO", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasAnyRole("GESTOR", "ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/produtos").hasAnyRole("GESTOR", "FUNCIONARIO", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/produtos/**").hasAnyRole("GESTOR", "FUNCIONARIO", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/produtos/**").hasAnyRole("GESTOR", "ADMIN")

                        .requestMatchers("/api/usuarios/admin/**").hasRole("GESTOR")

                        // Apenas gestores podem VER todos os feedbacks
                        .requestMatchers(HttpMethod.GET, "/api/feedbacks").hasAnyAuthority("GESTOR", "ADMIN", "ROLE_GESTOR", "ROLE_ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Libera as portas comuns de desenvolvimento frontend (Vite/React)
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}