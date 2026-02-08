package mba.ivens.padoca.modules.produto.dto;

public record CategoriaResponseDTO(
        Long id,
        String nome,
        String descricao,
        String tipoExibicao,
        Boolean ativo
) {}
