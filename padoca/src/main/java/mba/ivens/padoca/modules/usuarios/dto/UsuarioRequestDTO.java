package mba.ivens.padoca.modules.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import mba.ivens.padoca.modules.usuarios.model.enums.TipoUsuario;
import org.hibernate.validator.constraints.br.CPF;

public record UsuarioRequestDTO(
        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Formato de email inválido")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        String senha,

        //@CPF(message = "CPF inválido")
        String cpf,

        @NotNull(message = "Tipo de usuário é obrigatório")
        TipoUsuario tipo,

        String cargo,
        String matricula
        ) {}
