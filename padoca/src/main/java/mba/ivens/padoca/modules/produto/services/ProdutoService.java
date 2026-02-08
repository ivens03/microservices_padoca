package mba.ivens.padoca.modules.produto.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.config.exception.exeption.BusinessException;
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
        Produto produto = new Produto();
        produto.setNome(dto.nome());
        produto.setDescricao(dto.descricao());
        produto.setPreco(dto.preco());
        produto.setQuantidadeEstoque(dto.quantidadeEstoque());
        produto.setDiaDaSemanaDisponivel(dto.diaDaSemanaDisponivel());
        produto.setAtivo(true);

        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new BusinessException("Categoria não encontrada com ID: " + dto.categoriaId()));
        
        produto.setCategoria(categoria);
        
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

        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new BusinessException("Categoria não encontrada com ID: " + dto.categoriaId()));
        produto.setCategoria(categoria);

        if (novoCaminhoImagem != null) {
            produto.setImagemUrl(novoCaminhoImagem);
        }

        Produto atualizado = repository.save(produto);
        return mapper.toResponse(atualizado);
    }

    public List<ProdutoResponseDTO> listarTodosAtivos() {
        return repository.findByAtivoTrue().stream()
                .map(mapper::toResponse)
                .toList();
    }

    public List<ProdutoResponseDTO> listarPorCategoria(String categoriaNome) {
        return repository.findByCategoria_NomeAndAtivoTrue(categoriaNome).stream()
                .map(mapper::toResponse)
                .toList();
    }

    public List<ProdutoResponseDTO> listarAlmoco(String diaSemana) {
        return repository.findAlmocoDoDia("ALMOCO", diaSemana)
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
