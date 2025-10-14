package com.umg.proyectoanalisis.controller.cuentaporcobrar.crud;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.umg.proyectoanalisis.dto.requestdto.postdtos.NombreIdUsuarioDto;
import com.umg.proyectoanalisis.entity.cuentaporcobrar.StatusCuenta;
import com.umg.proyectoanalisis.repository.cuentaporcobrar.crud.StatusDeCuentasRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth/statusCuentas")
public class StatusDeCuentasController {

    @Autowired
    private StatusDeCuentasRepository statusDeCuentasRepository;

    @GetMapping("/obtener-status")
    public ResponseEntity<List<StatusCuenta>> obtenerStatus() {
        try {
            List<StatusCuenta> lista = statusDeCuentasRepository.findAll();
            if (lista.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(lista, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/crear-status")
    public ResponseEntity<StatusCuenta> crearStatus(@Valid @RequestBody NombreIdUsuarioDto statusDto) {
        try {
            StatusCuenta status = new StatusCuenta();
            status.setNombre(statusDto.getNombre());
            status.setFechaCreacion(LocalDateTime.now());
            status.setUsuarioCreacion(statusDto.getIdUsuario());
            StatusCuenta nuevo = statusDeCuentasRepository.save(status);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/actualizar-status/{id}")
    public ResponseEntity<StatusCuenta> actualizarStatus(@PathVariable Integer id,
            @Valid @RequestBody NombreIdUsuarioDto statusDto) {
        try {
            StatusCuenta existente = statusDeCuentasRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Status no encontrado con id: " + id));

            existente.setNombre(statusDto.getNombre());
            existente.setFechaModificacion(LocalDateTime.now());
            existente.setUsuarioModificacion(statusDto.getIdUsuario());
            StatusCuenta actualizado = statusDeCuentasRepository.save(existente);
            return new ResponseEntity<>(actualizado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/borrar-status/{id}")
    public ResponseEntity<String> borrarStatus(@PathVariable Integer id) {
        try {
            if (!statusDeCuentasRepository.existsById(id)) {
                return new ResponseEntity<>("Status no encontrado con id: " + id, HttpStatus.NOT_FOUND);
            }
            statusDeCuentasRepository.deleteById(id);
            return new ResponseEntity<>("Status eliminado exitosamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar el status", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
