package mba.ivens.padoca.modules.usuarios.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@Entity
@Table(name = "enderecos", schema = "acesso")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String logradouro; // Rua, Avenida...
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado; // UF
    private String cep;
    private String tipo; // Casa, Trabalho

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonBackReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Usuario usuario;
}
