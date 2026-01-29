package mba.ivens.padoca.modules.usuarios.repository;

import mba.ivens.padoca.modules.usuarios.model.Usuario;
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

    Optional<Usuario> findByIdAndAtivoTrue(Long id);
}
