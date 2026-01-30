package mba.ivens.padoca.modules.produto.dtoMapper;

import mba.ivens.padoca.modules.produto.dto.ProdutoRequestDTO;
import mba.ivens.padoca.modules.produto.dto.ProdutoResponseDTO;
import mba.ivens.padoca.modules.produto.model.Produto;
import org.springframework.stereotype.Component;

@Component
public class ProdutoMapper {

    public Produto toEntity(ProdutoRequestDTO dto) {
        Produto p = new Produto();
        p.setNome(dto.nome());
        p.setDescricao(dto.descricao());
        p.setPreco(dto.preco());
        p.setImagemUrl(dto.imagemUrl());
        p.setCategoria(dto.categoria());
        p.setDiaDaSemanaDisponivel(dto.diaDaSemanaDisponivel());
        // Ativo já é true por padrão
        return p;
    }

    public ProdutoResponseDTO toResponse(Produto entity) {
        return new ProdutoResponseDTO(
                entity.getId(),
                entity.getNome(),
                entity.getDescricao(),
                entity.getPreco(),
                entity.getImagemUrl(),
                entity.getCategoria(),
                entity.getDiaDaSemanaDisponivel()
        );
    }

}
