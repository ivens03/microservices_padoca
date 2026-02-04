package mba.ivens.padoca.modules.usuarios.dtoMapper;


import mba.ivens.padoca.modules.cliente.model.Cliente;
import mba.ivens.padoca.modules.funcionarios.model.Funcionario;
import mba.ivens.padoca.modules.usuarios.dto.EnderecoDTO;
import mba.ivens.padoca.modules.usuarios.dto.UsuarioRequestDTO;
import mba.ivens.padoca.modules.usuarios.dto.UsuarioResponseDTO;
import mba.ivens.padoca.modules.usuarios.model.Usuario;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class UsuarioMapper {

    public Usuario toEntity(UsuarioRequestDTO dto) {
        if (dto.tipo() == null) throw new IllegalArgumentException("Tipo não definido");

        return switch (dto.tipo()) {
            case CLIENTE -> {
                Cliente c = new Cliente();
                c.setNome(dto.nome());
                c.setEmail(dto.email());
                c.setSenha(dto.senha());
                c.setCpf(dto.cpf());
                c.setTelefone(dto.telefone()); // Adicionado
                yield c;
            }
            case FUNCIONARIO, ADMIN, ENTREGADOR, GESTOR -> {
                Funcionario f = new Funcionario();
                f.setNome(dto.nome());
                f.setEmail(dto.email());
                f.setSenha(dto.senha());
                f.setCpf(dto.cpf());
                f.setTelefone(dto.telefone());
                f.setMatricula(dto.matricula());
                f.setCargo(dto.cargo());
                yield f;
            }
        };
    }

    public UsuarioResponseDTO toResponse(Usuario entity) {
        // Mapeia a lista de endereços (Entity -> DTO)
        List<EnderecoDTO> enderecos = entity.getEnderecos() == null ? Collections.emptyList() :
                entity.getEnderecos().stream()
                        .map(e -> new EnderecoDTO(
                                e.getId(),
                                e.getLogradouro(),
                                e.getNumero(),
                                e.getComplemento(),
                                e.getBairro(),
                                e.getCidade(),
                                e.getEstado(),
                                e.getCep(),
                                e.getTipo()
                        )).toList();

        // Retorna o DTO com a estrutura nova (incluindo telefone e endereços)
        return new UsuarioResponseDTO(
                entity.getId(),
                entity.isAtivo(),
                entity.getCpf(),
                entity.getDataAtualizacao(),
                entity.getDataCriacao(),
                entity.getEmail(),
                entity.getNome(),
                entity.getTelefone(), // Adicionado
                entity.getTipo(),
                enderecos // Adicionado
        );
    }

}
