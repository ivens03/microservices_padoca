package mba.ivens.padoca.modules.pedido.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ItemPedidoRequestDTO(
        @NotNull Long produtoId,
        @Min(1) Integer quantidade
) {}