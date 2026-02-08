package mba.ivens.padoca.modules.produto.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.modules.produto.dto.CategoriaRequestDTO;
import mba.ivens.padoca.modules.produto.dto.CategoriaResponseDTO;
import mba.ivens.padoca.modules.produto.dtoMapper.CategoriaMapper;
import mba.ivens.padoca.modules.produto.model.Categoria;
import mba.ivens.padoca.modules.produto.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository repository;
    private final CategoriaMapper mapper;

    public List<CategoriaResponseDTO> listarTodas() {
        return repository.findByAtivoTrue().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public CategoriaResponseDTO salvar(CategoriaRequestDTO dto) {
        Categoria categoria = mapper.toEntity(dto);
        Categoria salvo = repository.save(categoria);
        return mapper.toResponse(salvo);
    }

    @Transactional
    public CategoriaResponseDTO atualizar(Long id, CategoriaRequestDTO dto) {
        Categoria categoria = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));

        categoria.setNome(dto.nome().toUpperCase());
        categoria.setDescricao(dto.descricao());
        categoria.setTipoExibicao(dto.tipoExibicao());

        Categoria atualizado = repository.save(categoria);
        return mapper.toResponse(atualizado);
    }

    @Transactional
    public void deletar(Long id) {
        Categoria categoria = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));
        categoria.setAtivo(false);
        repository.save(categoria);
    }

}
