package mba.ivens.padoca.modules.pedido.controller;

import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.modules.pedido.dto.DashboardStatsDTO;
import mba.ivens.padoca.modules.produto.repository.ProdutoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ProdutoRepository produtoRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        long criticos = produtoRepository.findAll().stream()
                .filter(p -> p.getQuantidadeEstoque() <= p.getEstoqueMinimo())
                .count();
        BigDecimal vendasHoje = BigDecimal.valueOf(1250.00);
        long fila = 5;
        return ResponseEntity.ok(new DashboardStatsDTO(
                vendasHoje,
                criticos,
                fila,
                35.5
        ));
    }
}
