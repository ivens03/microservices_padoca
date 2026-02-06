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
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {

        String caminhoImagem = null;
        if (imagem != null && !imagem.isEmpty()) {
            caminhoImagem = fileService.salvarArquivo(imagem);
        }
        var response = service.criarProduto(dto, caminhoImagem);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --- 2. LISTAR (GERAL OU POR CATEGORIA) ---
    @Operation(summary = "Listar Produtos", description = "Lista todos os produtos ativos. Use o parâmetro opcional 'categoriaNome' para filtrar.")
    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listar(
            @Parameter(description = "Nome da categoria. Ex: CONFEITARIA, BEBIDAS, MERCEARIA")
            @RequestParam(required = false) String categoriaNome) {

        if (categoriaNome != null) {
            return ResponseEntity.ok(service.listarPorCategoria(categoriaNome));
        }
        return ResponseEntity.ok(service.listarTodosAtivos());
    }

    // --- 3. BUSCAR PRODUTO POR ID ---
    @Operation(summary = "Buscar Produto por ID", description = "Retorna um produto específico pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Produto encontrado"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Long id) {
        var response = service.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    // --- 4. ATUALIZAR PRODUTO ---
    @Operation(summary = "Atualizar Produto", description = "Atualiza um produto existente, incluindo a imagem opcional.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Produto atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação nos dados enviados"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<ProdutoResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestPart("produto") @Valid ProdutoRequestDTO dto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {

        String caminhoImagem = null;
        // Se uma nova imagem for enviada, salve-a. Caso contrário, mantenha a imagem existente.
        if (imagem != null && !imagem.isEmpty()) {
            caminhoImagem = fileService.salvarArquivo(imagem);
        }
        var response = service.atualizarProduto(id, dto, caminhoImagem);
        return ResponseEntity.ok(response);
    }

    // --- 5. DESATIVAR PRODUTO ---
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
