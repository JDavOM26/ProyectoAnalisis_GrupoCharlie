package com.umg.proyectoAnalasis.controller.ControladoresPrincipales;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoAnalasis.entity.EntidadesPrincipales.Usuario;
import com.umg.proyectoAnalasis.repository.RepositoriosPrincipales.UsuarioRepository;

@RestController
@RequestMapping("/api/auth")

public class UsuarioController {

    @Autowired
    UsuarioRepository userRepository;
    //CON ESTO SE ENCRIPTA LA CONTRASEÑA DEL USUARIO CREADO
    @Autowired
    PasswordEncoder encoder;

/* OBTENER USUARIO
 * CREAR USUARIO
 * ACTUALIZAR USUARIO
 * BORRAR USUARIO
 */

    @GetMapping("/getAllUsers")
    public List<Usuario> obtenerUsuarios(){
        return  userRepository.findAll();
    }

    @DeleteMapping("/deleteUser/{idUsuario}")
    public void borrarUsuarioPorId(@PathVariable String idUsuario){
        userRepository.deleteById(idUsuario);
    }

    @PutMapping("/updateUser")
    public Usuario updateUsuario(@RequestBody Usuario usuario){
        return userRepository.save(usuario);
    }
    
      //Pendiente de trabajar
    @PostMapping("/signup")
    public String registerUser(@RequestBody Usuario user) {
        if (userRepository.existsByIdUsuario(user.getIdUsuario())) {
            return "Error: username ya tomado!";
        }
        
        Usuario newUser = new Usuario();
            
                newUser.setIdUsuario(user.getIdUsuario());
                newUser.setPassword( encoder.encode(user.getPassword()));
        userRepository.save(newUser);
        return "Usuario registrado exitosamente!";
    }


}
