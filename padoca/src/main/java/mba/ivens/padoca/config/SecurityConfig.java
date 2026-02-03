package mba.ivens.padoca.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // --- ROTAS PÚBLICAS ---
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll() // Cadastro de Clientes
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll() // Documentação

                        // --- ROTAS DE GESTOR ---
                        // Apenas Gestor pode gerenciar usuários (criar funcionários, inativar contas)
                        .requestMatchers("/api/usuarios/admin/**").hasRole("GESTOR")

                        // --- ROTAS DE PRODUTOS/ESTOQUE ---
                        // Gestor e Funcionario podem mexer no estoque/produtos
                        .requestMatchers(HttpMethod.POST, "/api/produtos").hasAnyRole("GESTOR", "FUNCIONARIO")
                        .requestMatchers(HttpMethod.PUT, "/api/produtos/**").hasAnyRole("GESTOR", "FUNCIONARIO")
                        .requestMatchers(HttpMethod.DELETE, "/api/produtos/**").hasRole("GESTOR") // Só gestor deleta

                        // --- ROTAS DE PEDIDOS ---
                        // Cliente cria pedido
                        .requestMatchers(HttpMethod.POST, "/api/pedidos").hasRole("CLIENTE")
                        // Equipe vê e atualiza pedidos
                        .requestMatchers(HttpMethod.GET, "/api/pedidos").hasAnyRole("GESTOR", "FUNCIONARIO")
                        .requestMatchers(HttpMethod.PATCH, "/api/pedidos/**").hasAnyRole("GESTOR", "FUNCIONARIO")

                        // O resto precisa estar logado
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
