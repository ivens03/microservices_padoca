package mba.ivens.padoca.modules.produto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "produtos", schema = "estoque")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(length = 1000)
    private String descricao;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    private String imagemUrl;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Categoria categoria;

    @Column(nullable = false)
    private Boolean ativo = true;

    private Integer quantidadeEstoque = 0;

    private Integer estoqueMinimo = 5;

    private String diaDaSemanaDisponivel;

    @CreationTimestamp
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;
}
