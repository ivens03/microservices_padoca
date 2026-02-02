package mba.ivens.padoca.modules.pedido.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import mba.ivens.padoca.modules.pedido.model.enums.StatusPedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos", schema = "vendas")
@Data
@NoArgsConstructor
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cliente; // Nome do cliente ou "Mesa 01"

    @Enumerated(EnumType.STRING)
    private StatusPedido status = StatusPedido.PENDENTE;

    private String tipo; // "BALCAO", "ENTREGA"

    private BigDecimal total = BigDecimal.ZERO;

    private LocalDateTime dataCriacao = LocalDateTime.now();

    // Relacionamento: Um pedido tem vários itens
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens = new ArrayList<>();

    public void adicionarItem(ItemPedido item) {
        itens.add(item);
        item.setPedido(this);
        this.total = this.total.add(item.getSubtotal());
    }
}