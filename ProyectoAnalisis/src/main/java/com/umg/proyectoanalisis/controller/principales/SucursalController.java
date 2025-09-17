package com.umg.proyectoanalisis.controller.principales;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.umg.proyectoanalisis.dto.requestdto.postdtos.SucursalPostDto;
import com.umg.proyectoanalisis.entity.principales.Sucursal;
import com.umg.proyectoanalisis.repository.principales.SucursalRepository;

import jakarta.validation.Valid;

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
    public ResponseEntity<Sucursal> crearSucursal(@Valid @RequestBody SucursalPostDto sucursalDto) {
        try {
            Sucursal sucursal = new Sucursal();
            sucursal.setNombre(sucursalDto.getNombre());
            sucursal.setDireccion(sucursalDto.getDireccion());
            sucursal.setIdEmpresa(sucursalDto.getIdEmpresa());
            sucursal.setFechaCreacion(LocalDateTime.now());
            sucursal.setUsuarioCreacion(sucursalDto.getIdUsuario());

            Sucursal sucursalGuardada = sucursalRepository.save(sucursal);
            return new ResponseEntity<>(sucursalGuardada, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Actualizar sucursal
    @PutMapping("/ActualizarSucursal/{idSucursal}")
    public ResponseEntity<Sucursal> actualizarSucursal(@PathVariable Integer idSucursal, @Valid @RequestBody SucursalPostDto sucursalDto) {
        try {
            Sucursal sucursalExistente = sucursalRepository.findById(idSucursal)
                    .orElseThrow(
                            () -> new RuntimeException("Sucursal no encontrada"));

          

            sucursalExistente.setNombre(sucursalDto.getNombre());
            sucursalExistente.setDireccion(sucursalDto.getDireccion());
            sucursalExistente.setIdEmpresa(sucursalDto.getIdEmpresa());
            sucursalExistente.setFechaModificacion(LocalDateTime.now());
            sucursalExistente.setUsuarioModificacion(sucursalDto.getIdUsuario());

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
