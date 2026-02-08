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
                entity.getCategoria() != null ? entity.getCategoria().getNome() : null,
                entity.getCategoria() != null ? entity.getCategoria().getId() : null,
                entity.getQuantidadeEstoque(),
                entity.getEstoqueMinimo(),
                entity.getDiaDaSemanaDisponivel()
        );
    }

}
