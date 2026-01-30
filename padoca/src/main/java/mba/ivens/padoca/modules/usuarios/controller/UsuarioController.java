package mba.ivens.padoca.modules.usuarios.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.modules.usuarios.dto.UsuarioRequestDTO;
import mba.ivens.padoca.modules.usuarios.dto.UsuarioResponseDTO;
import mba.ivens.padoca.modules.usuarios.services.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuários", description = "Endpoints para gestão de Clientes e Funcionários")
public class UsuarioController {

    private final UsuarioService service;

    @Operation(summary = "Criar novo usuário", description = "Cadastra um Cliente ou Funcionário baseado no tipo.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação (Email/CPF duplicado)")
    })
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criar(@RequestBody @Valid UsuarioRequestDTO dto) {
        var response = service.criarUsuario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Listar todos", description = "Retorna lista de todos os usuários do sistema.")
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @Operation(summary = "Listar usuários ativos", description = "Retorna a lista de todos os usuários que possuem a flag 'ativo' como TRUE.")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping("/ativos")
    public ResponseEntity<List<UsuarioResponseDTO>> listarAtivos() {
        return ResponseEntity.ok(service.listarTodosAtivos());
    }

    @Operation(summary = "Buscar usuário por ID", description = "Retorna os detalhes de um usuário específico. Se o usuário estiver inativo ou não existir, retorna 404.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário encontrado"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado ou inativo")
    })
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(
            @Parameter(description = "ID do usuário", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorAtivoPorId(id));
    }
}
