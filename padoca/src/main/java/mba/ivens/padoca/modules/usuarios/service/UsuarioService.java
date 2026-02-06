package mba.ivens.padoca.modules.usuarios.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.config.exception.exeption.BusinessException;
import mba.ivens.padoca.modules.usuarios.dto.EnderecoDTO;
import mba.ivens.padoca.modules.usuarios.dto.UsuarioRequestDTO;
import mba.ivens.padoca.modules.usuarios.dto.UsuarioResponseDTO;
import mba.ivens.padoca.modules.usuarios.dtoMapper.UsuarioMapper;
import mba.ivens.padoca.modules.usuarios.model.Endereco;
import mba.ivens.padoca.modules.usuarios.model.Usuario;
import mba.ivens.padoca.modules.usuarios.model.enums.TipoUsuario;
import mba.ivens.padoca.modules.usuarios.repository.EnderecoRepository;
import mba.ivens.padoca.modules.usuarios.repository.UsuarioRepository;
import org.springframework.data.domain.Page; // Importação CORRETA
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable; // Importação CORRETA
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository repository;
    private final UsuarioMapper mapper;
    private final PasswordEncoder passwordEncoder;
    private final EnderecoRepository enderecoRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com e-mail: " + email));
    }

    @Transactional
    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO dto) {
        if (repository.existsByEmail(dto.email())) {
            throw new BusinessException("Já existe um usuário cadastrado com este e-mail.");
        }
        if (dto.cpf() != null && !dto.cpf().isBlank() && repository.existsByCpf(dto.cpf())) {
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

    public Page<UsuarioResponseDTO> listarAtivosPaginado(TipoUsuario tipo, Pageable pageable) {
        Page<Usuario> usuariosPage;
        if (tipo != null) {
            usuariosPage = repository.findAllByTipoAndAtivoTrue(tipo, pageable);
        } else {
            usuariosPage = repository.findAllByAtivoTrue(pageable);
        }
        return usuariosPage.map(mapper::toResponse);
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
        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));
        return mapper.toResponse(usuario);
    }

    @Transactional
    public UsuarioResponseDTO atualizarPerfil(String email, String nome, String telefone) {
        Usuario usuario = repository.findAll().stream()
                .filter(u -> u.getEmail().equals(email)).findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        usuario.setNome(nome);
        usuario.setTelefone(telefone);

        return mapper.toResponse(repository.save(usuario));
    }

    @Transactional
    public UsuarioResponseDTO adicionarEndereco(String email, EnderecoDTO dto) {
        Usuario usuario = repository.findAll().stream()
                .filter(u -> u.getEmail().equals(email)).findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        Endereco end = new Endereco();
        end.setLogradouro(dto.logradouro());
        end.setNumero(dto.numero());
        end.setComplemento(dto.complemento());
        end.setBairro(dto.bairro());
        end.setCidade(dto.cidade());
        end.setEstado(dto.estado());
        end.setCep(dto.cep());
        end.setTipo(dto.tipo());
        end.setUsuario(usuario);
        usuario.getEnderecos().add(end);
        repository.save(usuario);
        return mapper.toResponse(usuario);
    }

    @Transactional
    public void removerEndereco(String email, Long enderecoId) {
        Usuario usuario = repository.findAll().stream()
                .filter(u -> u.getEmail().equals(email)).findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        Endereco endereco = enderecoRepository.findById(enderecoId)
                .orElseThrow(() -> new EntityNotFoundException("Endereço não encontrado"));
        if (!endereco.getUsuario().getId().equals(usuario.getId())) {
            throw new BusinessException("Você não tem permissão para excluir este endereço.");
        }
        usuario.getEnderecos().remove(endereco);
        enderecoRepository.delete(endereco);
    }

}