package mba.ivens.padoca.modules.usuarios.dto;

import mba.ivens.padoca.modules.usuarios.model.enums.TipoUsuario;

import java.time.LocalDateTime;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        TipoUsuario tipo,
        Integer pontosFidelidade,
        String cargo,
        LocalDateTime dataCriacao
) {}
