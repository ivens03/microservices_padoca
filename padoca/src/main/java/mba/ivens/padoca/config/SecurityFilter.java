package mba.ivens.padoca.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.modules.usuarios.repository.UsuarioRepository;
import mba.ivens.padoca.modules.usuarios.service.TokenService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = this.recoverToken(request);
        if (token != null) {
            var login = tokenService.validateToken(token);

            if (!login.isEmpty()) {
                // CORREÇÃO: Usando findByEmail em vez de findAll() stream
                UserDetails user = usuarioRepository.findByEmail(login).orElse(null);

                if (user != null) {
                    // LOG DE DEBUG: Veja isso no console do IntelliJ quando der erro 403!
                    System.out.println(">>> USUÁRIO AUTENTICADO: " + login);
                    System.out.println(">>> AUTHORITIES CARREGADAS: " + user.getAuthorities());

                    var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}