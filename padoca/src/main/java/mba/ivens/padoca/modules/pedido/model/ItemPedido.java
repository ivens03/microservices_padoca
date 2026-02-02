package mba.ivens.padoca.modules.pedido.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import mba.ivens.padoca.modules.produto.model.Produto;

import java.math.BigDecimal;

@Entity
@Table(name = "itens_pedido", schema = "vendas")
@Data
@NoArgsConstructor
public class ItemPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;

    private Integer quantidade;
    private BigDecimal precoUnitario; // Preço no momento da compra

    public BigDecimal getSubtotal() {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }
}
