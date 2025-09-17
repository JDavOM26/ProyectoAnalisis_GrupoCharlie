package com.umg.proyectoanalisis.controller.principales;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.umg.proyectoanalisis.entity.principales.Sucursal;
import com.umg.proyectoanalisis.repository.principales.SucursalRepository;

@RestController
@RequestMapping("/api/auth/sucursal")
public class SucursalController {

    @Autowired
    SucursalRepository sucursalRepository;

    @GetMapping("/GetSucursales")
    public ResponseEntity<List<Sucursal>> getAllSucursales() {
        try {
            List<Sucursal> sucursales = sucursalRepository.findAll();
            if (sucursales.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(sucursales, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Crear sucursal
    @PostMapping("/CrearSucursal")
    public ResponseEntity<Sucursal> crearSucursal(@RequestBody Sucursal sucursal) {
        try {
            if (sucursal.getNombre() == null || sucursal.getNombre().isEmpty() ||
                    sucursal.getDireccion() == null || sucursal.getDireccion().isEmpty() ||
                    sucursal.getIdEmpresa() == null) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            sucursal.setFechaCreacion(LocalDateTime.now());
            sucursal.setUsuarioCreacion("Administrador");

            Sucursal sucursalGuardada = sucursalRepository.save(sucursal);
            return new ResponseEntity<>(sucursalGuardada, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Actualizar sucursal
    @PutMapping("/ActualizarSucursal")
    public ResponseEntity<Sucursal> actualizarSucursal(@RequestBody Sucursal sucursal) {
        try {
            Sucursal sucursalExistente = sucursalRepository.findById(sucursal.getIdSucursal())
                    .orElseThrow(
                            () -> new RuntimeException("Sucursal no encontrada con id: " + sucursal.getIdSucursal()));

            if (sucursal.getNombre() == null || sucursal.getNombre().isEmpty() ||
                    sucursal.getDireccion() == null || sucursal.getDireccion().isEmpty() ||
                    sucursal.getIdEmpresa() == null) { // Cambiado de getEmpresa() a getIdEmpresa()
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            sucursalExistente.setNombre(sucursal.getNombre());
            sucursalExistente.setDireccion(sucursal.getDireccion());
            sucursalExistente.setIdEmpresa(sucursal.getIdEmpresa());
            sucursalExistente.setFechaModificacion(LocalDateTime.now());
            sucursalExistente.setUsuarioModificacion("Administrador");

            Sucursal sucursalActualizada = sucursalRepository.save(sucursalExistente);
            return new ResponseEntity<>(sucursalActualizada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Eliminar sucursal
    @DeleteMapping("/BorrarSucursal")
    public ResponseEntity<String> borrarSucursal(@RequestParam Integer idSucursal) {
        try {
            if (!sucursalRepository.existsById(idSucursal)) {
                return new ResponseEntity<>("Sucursal no encontrada con id: " + idSucursal, HttpStatus.NOT_FOUND);
            }
            sucursalRepository.deleteById(idSucursal);
            return new ResponseEntity<>("Sucursal eliminada exitosamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar la sucursal", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
