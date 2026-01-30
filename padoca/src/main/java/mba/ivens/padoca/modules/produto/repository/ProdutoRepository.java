package mba.ivens.padoca.modules.produto.repository;

import mba.ivens.padoca.modules.produto.model.Produto;
import mba.ivens.padoca.modules.produto.model.enums.CategoriaProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByAtivoTrue();

    List<Produto> findByCategoriaAndAtivoTrue(CategoriaProduto categoria);

    @Query("""
        SELECT p FROM Produto p 
        WHERE p.ativo = true 
        AND p.categoria = :categoria 
        AND (p.diaDaSemanaDisponivel = :diaSemana OR p.diaDaSemanaDisponivel IS NULL)
    """)
    List<Produto> findAlmocoDoDia(
            @Param("categoria") CategoriaProduto categoria,
            @Param("diaSemana") String diaSemana
    );

    Optional<Produto> findByIdAndAtivoTrue(Long id);

}
