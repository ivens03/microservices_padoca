package mba.ivens.padoca.modules.produto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequestDTO(
        
        @NotBlank(message = "O nome da categoria é obrigatório")
        @Size(min = 3, max = 50, message = "O nome deve ter entre 3 e 50 caracteres")
        String nome,

        @Size(max = 255, message = "A descrição pode ter no máximo 255 caracteres")
        String descricao,

        @Size(max = 50, message = "O tipo de exibição pode ter no máximo 50 caracteres") // Validação de tamanho
        String tipoExibicao // Novo campo tipoExibicao
) {}
