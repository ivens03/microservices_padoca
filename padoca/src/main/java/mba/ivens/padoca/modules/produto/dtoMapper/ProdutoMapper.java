package mba.ivens.padoca.modules.produto.dtoMapper;

import mba.ivens.padoca.modules.produto.dto.ProdutoRequestDTO;
import mba.ivens.padoca.modules.produto.dto.ProdutoResponseDTO;
import mba.ivens.padoca.modules.produto.model.Produto;
import org.springframework.stereotype.Component;

@Component
public class ProdutoMapper {



    public ProdutoResponseDTO toResponse(Produto entity) {
        return new ProdutoResponseDTO(
                entity.getId(),
                entity.getNome(),
                entity.getDescricao(),
                entity.getPreco(),
                entity.getImagemUrl(),
                entity.getCategoria() != null ? entity.getCategoria().getNome() : null, // Handle null category
                entity.getCategoria() != null ? entity.getCategoria().getId() : null,   // Add categoriaId
                entity.getQuantidadeEstoque(),  // Add quantidadeEstoque
                entity.getEstoqueMinimo(),      // Add estoqueMinimo
                entity.getDiaDaSemanaDisponivel()
        );
    }

}
