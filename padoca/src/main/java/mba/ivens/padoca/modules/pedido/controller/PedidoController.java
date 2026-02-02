package mba.ivens.padoca.modules.pedido.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.modules.pedido.dto.PedidoRequestDTO;
import mba.ivens.padoca.modules.pedido.dto.PedidoResponseDTO;
import mba.ivens.padoca.modules.pedido.services.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@Tag(name = "Pedidos", description = "Gestão de pedidos e fila da cozinha")
public class PedidoController {

    private final PedidoService service;

    @GetMapping
    @Operation(summary = "Fila de Pedidos", description = "Lista pedidos em aberto para a cozinha/balcão.")
    public ResponseEntity<List<PedidoResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarFilaCozinha());
    }

    @PostMapping
    @Operation(summary = "Novo Pedido", description = "Registra uma venda.")
    public ResponseEntity<PedidoResponseDTO> criar(@RequestBody @Valid PedidoRequestDTO dto) {
        return ResponseEntity.status(201).body(service.criar(dto));
    }

    @PatchMapping("/{id}/avancar")
    @Operation(summary = "Avançar Status", description = "Muda o status do pedido (Pendente -> Preparando -> Concluido).")
    public ResponseEntity<PedidoResponseDTO> avancarStatus(@PathVariable Long id) {
        return ResponseEntity.ok(service.avancarStatus(id));
    }
}