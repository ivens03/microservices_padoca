package mba.ivens.padoca.modules.produto.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.modules.produto.dto.ProdutoRequestDTO;
import mba.ivens.padoca.modules.produto.dto.ProdutoResponseDTO;
import mba.ivens.padoca.modules.produto.dtoMapper.ProdutoMapper;
import mba.ivens.padoca.modules.produto.model.Produto;
import mba.ivens.padoca.modules.produto.model.enums.CategoriaProduto;
import mba.ivens.padoca.modules.produto.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repository;
    private final ProdutoMapper mapper;

    @Transactional
    public ProdutoResponseDTO criarProduto(ProdutoRequestDTO dto, String caminhoImagem) {
        Produto produto = mapper.toEntity(dto);
        produto.setImagemUrl(caminhoImagem);
        Produto salvo = repository.save(produto);
        return mapper.toResponse(salvo);
    }

    // Lista TUDO que está ativo (para a aba "Todos")
    public List<ProdutoResponseDTO> listarTodosAtivos() {
        return repository.findByAtivoTrue().stream()
                .map(mapper::toResponse)
                .toList();
    }

    // Filtra por Categoria (Ex: Só BEBIDAS, Só MERCEARIA)
    public List<ProdutoResponseDTO> listarPorCategoria(CategoriaProduto categoria) {
        return repository.findByCategoriaAndAtivoTrue(categoria).stream()
                .map(mapper::toResponse)
                .toList();
    }

    // Método especial para Almoço: Traz o que é do dia específico OU o que é de "Todos os dias"
    public List<ProdutoResponseDTO> listarAlmoco(String diaSemana) {
        return repository.findAlmocoDoDia(CategoriaProduto.ALMOCO, diaSemana)
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
