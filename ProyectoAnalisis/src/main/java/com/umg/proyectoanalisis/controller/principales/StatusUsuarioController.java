package com.umg.proyectoanalisis.controller.principales;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
    public List<StatusUsuario> getStatusUsuario() {
        return statusUsuarioRepository.findAll();
    }

    @PostMapping("/crear-status")
    public StatusUsuario crearStatusUsuario(@RequestBody StatusUsuario statusUsuario) {

        statusUsuario.setFechaCreacion(LocalDateTime.now());
        statusUsuario.setUsuarioCreacion("Administrador");
        return statusUsuarioRepository.save(statusUsuario);
    }

    @PutMapping("/actualizar-status")
    public StatusUsuario actualizarStatusUsuario(@RequestBody StatusUsuario statusUsuario) {
        StatusUsuario estadoExistente = statusUsuarioRepository.findById(statusUsuario.getIdStatusUsuario())
                .orElseThrow(() -> new RuntimeException(
                        "Género no encontrado con id: " + statusUsuario.getIdStatusUsuario()));

        estadoExistente.setFechaModificacion(LocalDateTime.now());
        estadoExistente.setUsuarioModificacion("Administrador");
        return statusUsuarioRepository.save(estadoExistente);
    }

    @DeleteMapping("/borrar-status")
    public void borrarStatusUsuario(@RequestParam Integer idStatus) {
        statusUsuarioRepository.deleteById(idStatus);
    }

    // Faltan Imprimir y Exportar
}
