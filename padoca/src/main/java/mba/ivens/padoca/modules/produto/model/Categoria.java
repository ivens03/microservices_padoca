package mba.ivens.padoca.modules.produto.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categorias", schema = "estoque")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    private String descricao;

    private String tipoExibicao; // Novo campo para indicar o tipo de exibição (Mercado, Almoço, etc.)

    private Boolean ativo = true;
}