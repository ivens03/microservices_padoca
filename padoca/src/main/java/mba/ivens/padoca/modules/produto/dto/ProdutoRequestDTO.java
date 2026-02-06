package mba.ivens.padoca.modules.produto.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import mba.ivens.padoca.modules.produto.model.enums.CategoriaProduto;

import java.math.BigDecimal;

public record ProdutoRequestDTO(
        @NotBlank(message = "O nome do produto é obrigatório")
        String nome,

        String descricao,

        @NotNull(message = "O preço é obrigatório")
        @DecimalMin(value = "0.01", message = "O preço deve ser maior que zero")
        BigDecimal preco,

        @NotNull(message = "A categoria é obrigatória")
        Long categoriaId,

        String imagemUrl,

        @NotNull(message = "A quantidade em estoque é obrigatória")
        Integer quantidadeEstoque,
        
        @NotNull(message = "O estoque mínimo é obrigatório")
        Integer estoqueMinimo,

        String diaDaSemanaDisponivel,

        @NotNull(message = "O status ativo é obrigatório")
        boolean ativo
) {}
