package mba.ivens.padoca.modules.pedido.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record PedidoRequestDTO(
        @NotBlank String cliente,
        @NotBlank String tipo, 
        @NotEmpty List<ItemPedidoRequestDTO> itens
) {}
