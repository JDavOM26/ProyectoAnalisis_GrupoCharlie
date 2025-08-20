package com.umg.proyectoanalisis.controller.principales;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.entity.principales.Usuario;
import com.umg.proyectoanalisis.repository.principales.UsuarioRepository;
import com.umg.proyectoanalisis.service.UserService;

@RestController
@RequestMapping("/api/auth")

public class UsuarioController {

    @Autowired
    UsuarioRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    UserService usuarioService;

    /*
     * OBTENER USUARIO
     * CREAR USUARIO
     * ACTUALIZAR USUARIO
     * BORRAR USUARIO
     */

    @GetMapping("/getAllUsers")
    public List<Usuario> obtenerUsuarios() {
        return userRepository.findAll();
    }

    @DeleteMapping("/deleteUser/{idUsuario}")
    public void borrarUsuarioPorId(@PathVariable String idUsuario) {
        userRepository.deleteById(idUsuario);
    }

    @PutMapping("/updateUser")
    public Usuario updateUsuario(@RequestBody Usuario usuario) {
        return userRepository.save(usuario);
    }

    // Registro de Usuarios. Consumo del servicio Logica en el UserService
    @PostMapping("/signup/{idEmpresa}")
    public ResponseEntity<String> registerUser(@RequestBody Usuario user, @PathVariable int idEmpresa) {
        try {
            boolean registrado = usuarioService.registrarUsuario(user, idEmpresa);

            if (registrado) {
                return ResponseEntity.ok("Usuario registrado exitosamente!");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: usuario ya existe o contraseña no válida");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }
}
