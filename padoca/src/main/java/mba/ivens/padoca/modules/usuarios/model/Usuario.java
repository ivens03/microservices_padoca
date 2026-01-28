package mba.ivens.padoca.modules.usuarios.model;

import jakarta.persistence.*;
import mba.ivens.padoca.modules.usuarios.model.enums.TipoUsuario;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

public class Usuario {

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

    @CreationTimestamp
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;

}
