package com.umg.proyectoanalisis.repository.principales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.principales.Usuario;





@Repository("usuarioRepository")
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
	//Verificar si el usuario existe antes de hacer el registro
	boolean existsByIdUsuario(String idUsuario);
	//Buscar el usuario para validar credenciales login
    Usuario findByIdUsuario(String idUsuario);
	   
}
