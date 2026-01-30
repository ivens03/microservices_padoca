package mba.ivens.padoca.modules.produto.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.modules.produto.dto.ProdutoRequestDTO;
import mba.ivens.padoca.modules.produto.dto.ProdutoResponseDTO;
import mba.ivens.padoca.modules.produto.model.enums.CategoriaProduto;
import mba.ivens.padoca.modules.produto.services.FileStorageService;
import mba.ivens.padoca.modules.produto.services.ProdutoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
@Tag(name = "Produtos", description = "Gestão do Cardápio, Mercado e Refeições")
public class ProdutoController {

    private final ProdutoService service;
    private final FileStorageService fileService;

    // --- 1. CADASTRAR PRODUTO ---
    @Operation(summary = "Cadastrar Produto", description = "Cria um item de menu, mercado ou almoço.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Produto criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação nos dados enviados")
    })
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ProdutoResponseDTO> criar(
            @RequestPart("produto") @Valid ProdutoRequestDTO dto,
            @RequestPart("imagem") MultipartFile imagem) {

        String caminhoImagem = fileService.salvarArquivo(imagem);
        var response = service.criarProduto(dto, caminhoImagem);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --- 2. LISTAR (GERAL OU POR CATEGORIA) ---
    @Operation(summary = "Listar Produtos", description = "Lista todos os produtos ativos. Use o parâmetro opcional 'categoria' para filtrar.")
    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listar(
            @Parameter(description = "Ex: CONFEITARIA, BEBIDAS, MERCEARIA")
            @RequestParam(required = false) CategoriaProduto categoria) {

        if (categoria != null) {
            return ResponseEntity.ok(service.listarPorCategoria(categoria));
        }
        return ResponseEntity.ok(service.listarTodosAtivos());
    }

    // --- 3. LISTAR ALMOÇO DO DIA ---
    @Operation(summary = "Cardápio de Almoço", description = "Retorna os pratos específicos do dia informado + pratos fixos (disponíveis todos os dias).")
    @GetMapping("/almoco")
    public ResponseEntity<List<ProdutoResponseDTO>> listarAlmoco(
            @Parameter(description = "Ex: 'Segunda-feira', 'Sábado'", required = true)
            @RequestParam String dia) {
        return ResponseEntity.ok(service.listarAlmoco(dia));
    }

    // --- 4. DESATIVAR PRODUTO ---
    @Operation(summary = "Desativar Produto", description = "Remove o produto do cardápio (Soft Delete).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Produto desativado"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        service.desativarProduto(id);
        return ResponseEntity.noContent().build();
    }

}
