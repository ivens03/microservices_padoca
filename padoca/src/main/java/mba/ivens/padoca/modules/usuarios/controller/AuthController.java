package mba.ivens.padoca.modules.usuarios.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.modules.usuarios.dto.LoginDTO;
import mba.ivens.padoca.modules.usuarios.dto.LoginResponseDTO;
import mba.ivens.padoca.modules.usuarios.dto.UsuarioResponseDTO;
import mba.ivens.padoca.modules.usuarios.dtoMapper.UsuarioMapper;
import mba.ivens.padoca.modules.usuarios.model.Usuario;
import mba.ivens.padoca.modules.usuarios.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final UsuarioMapper usuarioMapper;

    public AuthController(TokenService tokenService,
                          AuthenticationManager authenticationManager,
                          UsuarioMapper usuarioMapper) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
        this.usuarioMapper = usuarioMapper;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        var auth = authenticationManager.authenticate(usernamePassword);
        var usuario = (Usuario) auth.getPrincipal();
        var token = tokenService.gerarToken(usuario);
        UsuarioResponseDTO usuarioDTO = usuarioMapper.toResponse(usuario);
        return ResponseEntity.ok(new LoginResponseDTO(token, usuarioDTO));
    }
}
