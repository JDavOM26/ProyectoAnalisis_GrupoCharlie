package com.umg.proyectoAnalasis.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoAnalasis.entity.Usuario;



@Repository("userRepository")
public interface UserRepository extends JpaRepository<Usuario, String> {
	
	boolean existsByIdUsuario(String idUsuario);
    Usuario findByIdUsuario(String idUsuario);
	   
}
