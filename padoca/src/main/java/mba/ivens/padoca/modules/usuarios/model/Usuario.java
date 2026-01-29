package mba.ivens.padoca.modules.usuarios.model;

import jakarta.persistence.*;
import lombok.Data;
import mba.ivens.padoca.modules.usuarios.model.enums.TipoUsuario;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "usuarios", schema = "acesso")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false, length = 14)
    private String cpf;

    @Enumerated(EnumType.STRING)
    private TipoUsuario tipo;

    @Column
    private Boolean ativo = true;

    @CreationTimestamp
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;

}
