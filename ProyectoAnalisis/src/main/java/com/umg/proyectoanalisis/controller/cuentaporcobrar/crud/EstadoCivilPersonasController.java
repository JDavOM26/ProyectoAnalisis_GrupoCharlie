package com.umg.proyectoanalisis.controller.cuentaporcobrar.crud;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.dto.requestdto.postdtos.NombreIdUsuarioDto;
import com.umg.proyectoanalisis.entity.cuentaporcobrar.EstadoCivil;
import com.umg.proyectoanalisis.repository.cuentaporcobrar.crud.EstadoCivilRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth/estadoCivil")
public class EstadoCivilPersonasController {

    @Autowired
    private EstadoCivilRepository estadoCivilRepository;

    @GetMapping("/obtener-estado-civil")
    public ResponseEntity<List<EstadoCivil>> obtenerEstadoCivil() {
        try {
            List<EstadoCivil> lista = estadoCivilRepository.findAll();
            if (lista.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(lista, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/crear-estado-civil")
    public ResponseEntity<EstadoCivil> crearEstadoCivil(@Valid @RequestBody NombreIdUsuarioDto estadoCivilDto) {
        try {
            EstadoCivil estadoCivil = new EstadoCivil();
            estadoCivil.setNombre(estadoCivilDto.getNombre());
            estadoCivil.setFechaCreacion(LocalDateTime.now());
            estadoCivil.setUsuarioCreacion(estadoCivilDto.getIdUsuario());
            EstadoCivil nuevoEstado = estadoCivilRepository.save(estadoCivil);
            return new ResponseEntity<>(nuevoEstado, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/actualizar-estado-civil/{idEstadoCivil}")
    public ResponseEntity<EstadoCivil> actualizarEstadoCivil(
            @PathVariable Integer idEstadoCivil,
            @Valid @RequestBody NombreIdUsuarioDto estadoCivilDto) {
        try {
            EstadoCivil estadoCivilExistente = estadoCivilRepository.findById(idEstadoCivil)
                    .orElseThrow(() -> new RuntimeException("Estado civil no encontrado con id: " + idEstadoCivil));

            estadoCivilExistente.setNombre(estadoCivilDto.getNombre());
            estadoCivilExistente.setFechaModificacion(LocalDateTime.now());
            estadoCivilExistente.setUsuarioModificacion(estadoCivilDto.getIdUsuario());
            EstadoCivil actualizado = estadoCivilRepository.save(estadoCivilExistente);
            return new ResponseEntity<>(actualizado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/borrar-estado-civil/{idEstadoCivil}")
    public ResponseEntity<String> borrarEstadoCivil(@PathVariable Integer idEstadoCivil) {
        try {
            if (!estadoCivilRepository.existsById(idEstadoCivil)) {
                return new ResponseEntity<>("Estado civil no encontrado con id: " + idEstadoCivil, HttpStatus.NOT_FOUND);
            }
            estadoCivilRepository.deleteById(idEstadoCivil);
            return new ResponseEntity<>("Estado civil eliminado exitosamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar el estado civil", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

