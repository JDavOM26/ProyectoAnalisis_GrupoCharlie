package com.umg.proyectoAnalasis.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoAnalasis.entity.Usuario;



@Repository("userRepository")
public interface UserRepository extends JpaRepository<Usuario, String> {
	//Verificar si el usuario existe antes de hacer el registro
	boolean existsByIdUsuario(String idUsuario);
	//Buscar el usuario para validar credenciales login
    Usuario findByIdUsuario(String idUsuario);
	   
}
