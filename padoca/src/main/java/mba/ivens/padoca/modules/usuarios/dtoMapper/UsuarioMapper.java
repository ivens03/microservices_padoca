package mba.ivens.padoca.modules.usuarios.dtoMapper;


import mba.ivens.padoca.modules.cliente.model.Cliente;
import mba.ivens.padoca.modules.funcionarios.model.Funcionario;
import mba.ivens.padoca.modules.usuarios.dto.UsuarioRequestDTO;
import mba.ivens.padoca.modules.usuarios.dto.UsuarioResponseDTO;
import mba.ivens.padoca.modules.usuarios.model.Usuario;
import org.springframework.stereotype.Component;

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
                yield c;
            }
            case FUNCIONARIO, ADMIN, ENTREGADOR -> {
                Funcionario f = new Funcionario();
                f.setNome(dto.nome());
                f.setEmail(dto.email());
                f.setSenha(dto.senha());
                f.setCpf(dto.cpf());
                f.setMatricula(dto.matricula());
                f.setCargo(dto.cargo());
                yield f;
            }
        };
    }

    public UsuarioResponseDTO toResponse(Usuario entity) {
        Integer pontos = (entity instanceof Cliente c) ? c.getPontosFidelidade() : null;
        String cargo = (entity instanceof Funcionario f) ? f.getCargo() : null;

        return new UsuarioResponseDTO(
                entity.getId(),
                entity.getNome(),
                entity.getEmail(),
                entity.getTipo(),
                pontos,
                cargo,
                entity.getDataCriacao()
        );
    }

}
