package com.umg.proyectoanalisis.controller.principales;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.dto.requestdto.postdto.NombreIdUsuarioDto;
import com.umg.proyectoanalisis.entity.principales.StatusUsuario;
import com.umg.proyectoanalisis.repository.principales.StatusUsuarioRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
public class StatusUsuarioController {

    @Autowired
    StatusUsuarioRepository statusUsuarioRepository;

    @GetMapping("/status")
    public ResponseEntity<List<StatusUsuario>> obtenerStatusUsuario() {
        try {
            List<StatusUsuario> estados = statusUsuarioRepository.findAll();
            if (estados.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
            }
            return new ResponseEntity<>(estados, HttpStatus.OK); 
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }

    
    @PostMapping("/crear-status")
    public ResponseEntity<StatusUsuario> crearStatusUsuario(@RequestBody NombreIdUsuarioDto statusUsuarioDto) {
        try {
            if (statusUsuarioDto.getNombre() == null || statusUsuarioDto.getNombre().isEmpty()
            && statusUsuarioDto.getIdUsuario() == null || statusUsuarioDto.getIdUsuario().isEmpty()) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); 
            }
            StatusUsuario statusUsuario = new StatusUsuario();
            statusUsuario.setNombre(statusUsuarioDto.getNombre());
            statusUsuario.setFechaCreacion(LocalDateTime.now());
            statusUsuario.setUsuarioCreacion(statusUsuarioDto.getIdUsuario());
            StatusUsuario estadoGuardado = statusUsuarioRepository.save(statusUsuario);
            return new ResponseEntity<>(estadoGuardado, HttpStatus.CREATED); 
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }

   
    @PutMapping("/actualizar-status")
    public ResponseEntity<StatusUsuario> actualizarStatusUsuario(@RequestBody StatusUsuario statusUsuario) {
        try {
            StatusUsuario estadoExistente = statusUsuarioRepository.findById(statusUsuario.getIdStatusUsuario())
                    .orElseThrow(() -> new RuntimeException(
                            "Estado de usuario no encontrado con id: " + statusUsuario.getIdStatusUsuario()));
            if (statusUsuario.getNombre() == null || statusUsuario.getNombre().isEmpty()) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); 
            }
            estadoExistente.setNombre(statusUsuario.getNombre());
            estadoExistente.setFechaModificacion(LocalDateTime.now());
            estadoExistente.setUsuarioModificacion("Administrador");
            StatusUsuario estadoActualizado = statusUsuarioRepository.save(estadoExistente);
            return new ResponseEntity<>(estadoActualizado, HttpStatus.OK); 
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); 
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }

    
    @DeleteMapping("/borrar-status")
    public ResponseEntity<String> borrarStatusUsuario(@RequestParam Integer idStatus) {
        try {
            if (!statusUsuarioRepository.existsById(idStatus)) {
                return new ResponseEntity<>("Estado de usuario no encontrado con id: " + idStatus,
                        HttpStatus.NOT_FOUND); 
            }
            statusUsuarioRepository.deleteById(idStatus);
            return new ResponseEntity<>("Estado de usuario eliminado exitosamente", HttpStatus.OK); 
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar el estado de usuario", HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }

    // Faltan Imprimir y Exportar
}
