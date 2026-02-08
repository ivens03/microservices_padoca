package mba.ivens.padoca.modules.pedido.dto;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

public record PedidoResponseDTO(
        Long id,
        String cliente,
        String status,
        String tipo,
        BigDecimal total,
        String dataHora,
        List<String> descricaoItens 
) {}