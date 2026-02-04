package mba.ivens.padoca.modules.usuarios.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.config.exception.exeption.BusinessException;
import mba.ivens.padoca.modules.usuarios.dto.UsuarioRequestDTO;
import mba.ivens.padoca.modules.usuarios.dto.UsuarioResponseDTO;
import mba.ivens.padoca.modules.usuarios.dtoMapper.UsuarioMapper;
import mba.ivens.padoca.modules.usuarios.model.Usuario;
import mba.ivens.padoca.modules.usuarios.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository repository;
    private final UsuarioMapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return repository.findAll().stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com e-mail: " + email));
    }

    @Transactional
    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO dto) {
        if (repository.existsByEmail(dto.email())) {
            throw new BusinessException("Já existe um usuário cadastrado com este e-mail.");
        }
        if (dto.cpf() != null && repository.existsByCpf(dto.cpf())) {
            throw new BusinessException("Já existe um usuário cadastrado com este CPF.");
        }
        Usuario novoUsuario = mapper.toEntity(dto);
        novoUsuario.setSenha(passwordEncoder.encode(dto.senha()));
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

    public UsuarioResponseDTO buscarPorEmail(String email) {
        Usuario usuario = repository.findAll().stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));
        return mapper.toResponse(usuario);
    }

}