package mba.ivens.padoca.modules.funcionarios.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import mba.ivens.padoca.modules.usuarios.model.Usuario;
import mba.ivens.padoca.modules.usuarios.model.enums.TipoUsuario;

@Getter
@Setter
@Entity
@Table(name = "funcionarios", schema = "acesso")
public class Funcionario extends Usuario {

    private String matricula;
    private String cargo;

    public Funcionario() {
        this.setTipo(TipoUsuario.FUNCIONARIO);
    }

}
