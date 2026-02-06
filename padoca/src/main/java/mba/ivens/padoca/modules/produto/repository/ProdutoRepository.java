package mba.ivens.padoca.modules.produto.repository;

import mba.ivens.padoca.modules.produto.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByAtivoTrue();

    // Filtra por Categoria pelo nome da Categoria e produtos ativos
    List<Produto> findByCategoria_NomeAndAtivoTrue(String categoriaNome);

    @Query("""
        SELECT p FROM Produto p 
        WHERE p.ativo = true 
        AND p.categoria.nome = :categoriaNome 
        AND (p.diaDaSemanaDisponivel = :diaSemana OR p.diaDaSemanaDisponivel IS NULL)
    """)
    List<Produto> findAlmocoDoDia(
            @Param("categoriaNome") String categoriaNome, // Changed to String
            @Param("diaSemana") String diaSemana
    );

    Optional<Produto> findByIdAndAtivoTrue(Long id);

}
