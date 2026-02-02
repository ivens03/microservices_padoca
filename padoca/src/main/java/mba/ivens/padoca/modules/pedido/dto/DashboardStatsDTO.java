package mba.ivens.padoca.modules.pedido.dto;

import java.math.BigDecimal;

public record DashboardStatsDTO(
        BigDecimal totalVendasHoje,
        long itensCriticos, 
        long filaPedidos,
        double lucroMedio
) {}
