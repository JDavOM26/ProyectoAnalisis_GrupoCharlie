package com.umg.proyectoanalisis.controller.principales;

import java.time.LocalDateTime;
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
import com.umg.proyectoanalisis.dto.requestdto.postdtos.UsuarioPostDto;
import com.umg.proyectoanalisis.entity.principales.Usuario;
import com.umg.proyectoanalisis.repository.principales.UsuarioRepository;
import com.umg.proyectoanalisis.service.UserService;

import jakarta.validation.Valid;


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
    public ResponseEntity<List<Usuario>> obtenerUsuarios() {
        List<Usuario> usuarios = userRepository.findAll();
        if (usuarios.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(usuarios);
    }

    @DeleteMapping("/deleteUser/{idUsuario}")
    public ResponseEntity<String> borrarUsuarioPorId(@PathVariable String idUsuario) {
        if (!userRepository.existsById(idUsuario)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario con ID " + idUsuario + " no encontrado");
        }

        userRepository.deleteById(idUsuario);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }

    @PutMapping("/updateUser/{idUsuario}")
    public Usuario updateUsuario(@PathVariable String idUsuario, @Valid @RequestBody UsuarioPostDto usuarioDto) {

      
        Usuario usuarioExistente = userRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));


        usuarioExistente.setNombre(usuarioDto.getNombre());
        usuarioExistente.setApellido(usuarioDto.getApellido());
        usuarioExistente.setFechaNacimiento(usuarioDto.getFechaNacimiento());
        usuarioExistente.setIdStatusUsuario(usuarioDto.getIdStatusUsuario());
        usuarioExistente.setIdGenero(usuarioDto.getIdGenero());
        usuarioExistente.setCorreoElectronico(usuarioDto.getCorreoElectronico());
        usuarioExistente.setTelefonoMovil(usuarioDto.getTelefonoMovil());
        usuarioExistente.setIdSucursal(usuarioDto.getIdSucursal());
        usuarioExistente.setPregunta(usuarioDto.getPregunta());
        usuarioExistente.setRespuesta(usuarioDto.getRespuesta());
        usuarioExistente.setIdRole(usuarioDto.getIdRole());

        
        usuarioExistente.setFechaModificacion(LocalDateTime.now());
        usuarioExistente.setUsuarioModificacion(usuarioDto.getIdUsuario()); 

    
        return userRepository.save(usuarioExistente);
    }


    // Registro de Usuarios. Consumo del servicio Logica en el UserService
    @PostMapping("/signup/{idEmpresa}")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UsuarioPostDto usuarioDto, @PathVariable int idEmpresa) {
        try {
            boolean registrado = usuarioService.registrarUsuario(usuarioDto, idEmpresa);

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
