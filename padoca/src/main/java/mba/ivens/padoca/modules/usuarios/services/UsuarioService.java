package mba.ivens.padoca.modules.usuarios.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.modules.usuarios.dto.UsuarioRequestDTO;
import mba.ivens.padoca.modules.usuarios.dto.UsuarioResponseDTO;
import mba.ivens.padoca.modules.usuarios.dtoMapper.UsuarioMapper;
import mba.ivens.padoca.modules.usuarios.model.Usuario;
import mba.ivens.padoca.modules.usuarios.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final UsuarioMapper mapper;

    @Transactional
    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO dto) {
        if (repository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado.");
        }
        if (repository.existsByCpf(dto.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }
        Usuario novoUsuario = mapper.toEntity(dto);
        Usuario usuarioSalvo = repository.save(novoUsuario);
        return mapper.toResponse(usuarioSalvo);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    public List<UsuarioResponseDTO> listarTodosAtivos() {
        return repository.findAllByAtivoTrue().stream()
                .map(mapper::toResponse)
                .toList();
    }

    public UsuarioResponseDTO buscarPorAtivoPorId(Long id) {
        Usuario usuario = repository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado ou inativo."));

        return mapper.toResponse(usuario);
    }

    @Transactional
    public void desativarUsuario(Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        usuario.setAtivo(false);
        repository.save(usuario);
    }

}
