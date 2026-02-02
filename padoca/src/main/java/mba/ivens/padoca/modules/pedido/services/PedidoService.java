package mba.ivens.padoca.modules.pedido.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.modules.pedido.dto.PedidoRequestDTO;
import mba.ivens.padoca.modules.pedido.dto.PedidoResponseDTO;
import mba.ivens.padoca.modules.pedido.model.ItemPedido;
import mba.ivens.padoca.modules.pedido.model.Pedido;
import mba.ivens.padoca.modules.pedido.model.enums.StatusPedido;
import mba.ivens.padoca.modules.pedido.repository.PedidoRepository;
import mba.ivens.padoca.modules.produto.model.Produto;
import mba.ivens.padoca.modules.produto.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;

    public List<PedidoResponseDTO> listarFilaCozinha() {
        return pedidoRepository.findByStatusNot(StatusPedido.CONCLUIDO).stream()
                .filter(p -> p.getStatus() != StatusPedido.CANCELADO)
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PedidoResponseDTO criar(PedidoRequestDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setCliente(dto.cliente());
        pedido.setTipo(dto.tipo());

        dto.itens().forEach(itemDto -> {
            Produto produto = produtoRepository.findById(itemDto.produtoId())
                    .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + itemDto.produtoId()));
            ItemPedido item = new ItemPedido();
            item.setProduto(produto);
            item.setQuantidade(itemDto.quantidade());
            item.setPrecoUnitario(produto.getPreco());

            pedido.adicionarItem(item);
        });

        Pedido salvo = pedidoRepository.save(pedido);
        return toResponse(salvo);
    }

    @Transactional
    public PedidoResponseDTO avancarStatus(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido não encontrado"));
        switch (pedido.getStatus()) {
            case PENDENTE -> pedido.setStatus(StatusPedido.PREPARANDO);
            case PREPARANDO -> pedido.setStatus(StatusPedido.PRONTO);
            case PRONTO -> pedido.setStatus(pedido.getTipo().equals("ENTREGA") ? StatusPedido.EM_ENTREGA : StatusPedido.CONCLUIDO);
            case EM_ENTREGA -> pedido.setStatus(StatusPedido.CONCLUIDO);
            default -> throw new IllegalStateException("Status não pode ser avançado");
        }

        return toResponse(pedidoRepository.save(pedido));
    }

    private PedidoResponseDTO toResponse(Pedido pedido) {
        List<String> descricaoItens = pedido.getItens().stream()
                .map(i -> i.getQuantidade() + "x " + i.getProduto().getNome())
                .collect(Collectors.toList());

        return new PedidoResponseDTO(
                pedido.getId(),
                pedido.getCliente(),
                pedido.getStatus().name().toLowerCase(),
                pedido.getTipo(),
                pedido.getTotal(),
                pedido.getDataCriacao().format(DateTimeFormatter.ofPattern("HH:mm")),
                descricaoItens
        );
    }
}
