package mba.ivens.padoca.modules.usuarios.repository;

import mba.ivens.padoca.modules.usuarios.model.Usuario;
import mba.ivens.padoca.modules.usuarios.model.enums.TipoUsuario; // Importação adicionada
import org.springframework.data.domain.Page; // Importação adicionada
import org.springframework.data.domain.Pageable; // Importação adicionada
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    List<Usuario> findAllByAtivoTrue();
    Page<Usuario> findAllByAtivoTrue(Pageable pageable); // Novo método paginado
    Page<Usuario> findAllByTipoAndAtivoTrue(TipoUsuario tipo, Pageable pageable); // Novo método paginado e filtrado

    Optional<Usuario> findByIdAndAtivoTrue(Long id);
}
