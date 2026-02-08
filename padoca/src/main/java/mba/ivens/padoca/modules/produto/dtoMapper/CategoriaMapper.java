package mba.ivens.padoca.modules.produto.dtoMapper;

import mba.ivens.padoca.modules.produto.dto.CategoriaRequestDTO;
import mba.ivens.padoca.modules.produto.dto.CategoriaResponseDTO;
import mba.ivens.padoca.modules.produto.model.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    public Categoria toEntity(CategoriaRequestDTO dto) {
        Categoria entity = new Categoria();
        entity.setNome(dto.nome().toUpperCase());
        entity.setDescricao(dto.descricao());
        entity.setTipoExibicao(dto.tipoExibicao());
        entity.setAtivo(true);
        return entity;
    }

    public CategoriaResponseDTO toResponse(Categoria entity) {
        return new CategoriaResponseDTO(
                entity.getId(),
                entity.getNome(),
                entity.getDescricao(),
                entity.getTipoExibicao(),
                entity.getAtivo()
        );
    }

}
