package mba.ivens.padoca.modules.pedido.repository;

import mba.ivens.padoca.modules.pedido.model.Pedido;
import mba.ivens.padoca.modules.pedido.model.enums.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByStatusNot(StatusPedido status);

    long countByStatusNot(StatusPedido status);
}
