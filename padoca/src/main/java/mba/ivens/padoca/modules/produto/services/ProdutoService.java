package mba.ivens.padoca.modules.produto.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.config.exception.exeption.BusinessException; // Added for BusinessException
import mba.ivens.padoca.modules.produto.dto.ProdutoRequestDTO;
import mba.ivens.padoca.modules.produto.dto.ProdutoResponseDTO;
import mba.ivens.padoca.modules.produto.dtoMapper.ProdutoMapper;
import mba.ivens.padoca.modules.produto.model.Categoria;
import mba.ivens.padoca.modules.produto.model.Produto;
import mba.ivens.padoca.modules.produto.repository.CategoriaRepository;
import mba.ivens.padoca.modules.produto.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repository;
    private final ProdutoMapper mapper;
    private final CategoriaRepository categoriaRepository;

    @Transactional
    public ProdutoResponseDTO criarProduto(ProdutoRequestDTO dto, String caminhoImagem) {
        System.out.println("DEBUG: Entering criarProduto method. DTO categoriaId: " + dto.categoriaId()); // Entry log
        Produto produto = new Produto();
        produto.setNome(dto.nome());
        produto.setDescricao(dto.descricao());
        produto.setPreco(dto.preco());
        produto.setQuantidadeEstoque(dto.quantidadeEstoque());
        produto.setDiaDaSemanaDisponivel(dto.diaDaSemanaDisponivel());
        produto.setAtivo(true); // Always true on creation

        // Fetch Categoria entity by ID
        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> {
                    System.out.println("DEBUG: Categoria não encontrada no BD para ID: " + dto.categoriaId()); // Log for debugging
                    return new BusinessException("Categoria não encontrada com ID: " + dto.categoriaId());
                });
        
        System.out.println("DEBUG: Categoria encontrada - ID: " + categoria.getId() + ", Nome: " + categoria.getNome()); // Log for debugging
        
        produto.setCategoria(categoria);
        
        System.out.println("DEBUG: Produto antes de salvar - Categoria ID: " + (produto.getCategoria() != null ? produto.getCategoria().getId() : "NULL")); // New debug log
        System.out.println("DEBUG: Produto antes de salvar - Categoria Nome: " + (produto.getCategoria() != null ? produto.getCategoria().getNome() : "NULL")); // New debug log

        produto.setImagemUrl(caminhoImagem);
        Produto salvo = repository.save(produto);
        return mapper.toResponse(salvo);
    }

    public ProdutoResponseDTO buscarPorId(Long id) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com ID: " + id));
        return mapper.toResponse(produto);
    }

    @Transactional
    public ProdutoResponseDTO atualizarProduto(Long id, ProdutoRequestDTO dto, String novoCaminhoImagem) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com ID: " + id));

        produto.setNome(dto.nome());
        produto.setDescricao(dto.descricao());
        produto.setPreco(dto.preco());
        produto.setQuantidadeEstoque(dto.quantidadeEstoque());
        produto.setEstoqueMinimo(dto.estoqueMinimo());
        produto.setDiaDaSemanaDisponivel(dto.diaDaSemanaDisponivel());
        produto.setAtivo(dto.ativo());

        // Update Categoria
        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new BusinessException("Categoria não encontrada com ID: " + dto.categoriaId()));
        produto.setCategoria(categoria);

        // Update image path only if a new image was provided
        if (novoCaminhoImagem != null) {
            produto.setImagemUrl(novoCaminhoImagem);
        }
        // If no new image provided, and imagemUrl was sent as empty/null in DTO, it means to remove current image
        // For simplicity, we'll keep the old image if novoCaminhoImagem is null.
        // A more robust solution would check if dto explicitly clears the image.

        Produto atualizado = repository.save(produto);
        return mapper.toResponse(atualizado);
    }

    // Lista TUDO que está ativo (para a aba "Todos")
    public List<ProdutoResponseDTO> listarTodosAtivos() {
        return repository.findByAtivoTrue().stream()
                .map(mapper::toResponse)
                .toList();
    }

    // Filtra por Categoria pelo nome da Categoria e produtos ativos
    public List<ProdutoResponseDTO> listarPorCategoria(String categoriaNome) {
        return repository.findByCategoria_NomeAndAtivoTrue(categoriaNome).stream()
                .map(mapper::toResponse)
                .toList();
    }

    // Método especial para Almoço: Traz o que é do dia específico OU o que é de "Todos os dias"
    public List<ProdutoResponseDTO> listarAlmoco(String diaSemana) {
        return repository.findAlmocoDoDia("ALMOCO", diaSemana) // Use String literal "ALMOCO"
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public void desativarProduto(Long id) {
        Produto p = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));
        p.setAtivo(false);
        repository.save(p);
    }

}
