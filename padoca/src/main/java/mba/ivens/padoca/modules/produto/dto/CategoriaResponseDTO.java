package mba.ivens.padoca.modules.produto.dto;

public record CategoriaResponseDTO(
        Long id,
        String nome,
        String descricao,
        Boolean ativo
) {}
