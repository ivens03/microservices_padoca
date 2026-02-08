package mba.ivens.padoca.modules.usuarios.repository;

import mba.ivens.padoca.modules.usuarios.model.Usuario;
import mba.ivens.padoca.modules.usuarios.model.enums.TipoUsuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    Page<Usuario> findAllByAtivoTrue(Pageable pageable);
    Page<Usuario> findAllByTipoAndAtivoTrue(TipoUsuario tipo, Pageable pageable);

    Optional<Usuario> findByIdAndAtivoTrue(Long id);
}
