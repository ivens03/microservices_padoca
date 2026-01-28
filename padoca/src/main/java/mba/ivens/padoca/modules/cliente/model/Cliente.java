package mba.ivens.padoca.modules.cliente.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import mba.ivens.padoca.modules.usuarios.model.Usuario;

@Getter
@Setter
@Entity
@Table(name = "clientes", schema = "acesso")
public class Cliente extends Usuario {

    private Integer pontosFidelidade = 0;

}
