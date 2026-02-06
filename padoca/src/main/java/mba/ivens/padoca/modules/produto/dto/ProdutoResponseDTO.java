package mba.ivens.padoca.modules.produto.dto;

import mba.ivens.padoca.modules.produto.model.enums.CategoriaProduto;
import java.math.BigDecimal;

public record ProdutoResponseDTO(
        Long id,
        String nome,
        String descricao,
        BigDecimal preco,
        String imagemUrl,
        String categoriaNome,
        Long categoriaId,
        Integer quantidadeEstoque,
        Integer estoqueMinimo,
        String diaDaSemanaDisponivel
) {}
