package mba.ivens.padoca.modules.usuarios.dto;

import mba.ivens.padoca.modules.usuarios.model.enums.TipoUsuario;

import java.time.LocalDateTime;
import java.util.List;

public record UsuarioResponseDTO(
        Long id,
        boolean ativo,
        String cpf,
        LocalDateTime dataAtualizacao,
        LocalDateTime dataCriacao,
        String email,
        String nome,
        String telefone,
        TipoUsuario tipo,
        List<EnderecoDTO> enderecos
) {}
