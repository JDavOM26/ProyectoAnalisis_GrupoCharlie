package com.umg.proyectoanalisis.controller.cuentaporcobrar.crud;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.umg.proyectoanalisis.dto.requestdto.postdtos.TiposMovCxcPostDto;
import com.umg.proyectoanalisis.entity.cuentaporcobrar.TipoMovimientoCxc;
import com.umg.proyectoanalisis.repository.cuentaporcobrar.crud.TiposMovCxcRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth/tiposMovCC")
public class TiposMovCxcController {

    @Autowired
    private TiposMovCxcRepository tiposMovCCRepository;

    @GetMapping("/obtener-tipos")
    public ResponseEntity<List<TipoMovimientoCxc>> obtenerTipos() {
        try {
            List<TipoMovimientoCxc> lista = tiposMovCCRepository.findAll();
            if (lista.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(lista, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/crear-tipo")
    public ResponseEntity<TipoMovimientoCxc> crearTipo(@Valid @RequestBody TiposMovCxcPostDto tipoDto) {
        try {
            TipoMovimientoCxc nuevoTipo = new TipoMovimientoCxc();
            nuevoTipo.setNombre(tipoDto.getNombre());
            nuevoTipo.setOperacionCuentaCorriente(tipoDto.getOperacionCuentaCorriente());
            nuevoTipo.setFechaCreacion(LocalDateTime.now());
            nuevoTipo.setUsuarioCreacion(tipoDto.getIdUsuario());
            TipoMovimientoCxc nuevo = tiposMovCCRepository.save(nuevoTipo);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/actualizar-tipo/{id}")
    public ResponseEntity<TipoMovimientoCxc> actualizarTipo(@PathVariable Integer id,
            @Valid @RequestBody TiposMovCxcPostDto tipoDto) {
        try {
            TipoMovimientoCxc existente = tiposMovCCRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tipo de movimiento no encontrado con id: " + id));

            existente.setNombre(tipoDto.getNombre());
            existente.setOperacionCuentaCorriente(tipoDto.getOperacionCuentaCorriente());
            existente.setFechaModificacion(LocalDateTime.now());
            existente.setUsuarioModificacion(tipoDto.getIdUsuario());
            TipoMovimientoCxc actualizado = tiposMovCCRepository.save(existente);
            return new ResponseEntity<>(actualizado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/borrar-tipo/{id}")
    public ResponseEntity<String> borrarTipo(@PathVariable Integer id) {
        try {
            if (!tiposMovCCRepository.existsById(id)) {
                return new ResponseEntity<>("Tipo de movimiento no encontrado con id: " + id, HttpStatus.NOT_FOUND);
            }
            tiposMovCCRepository.deleteById(id);
            return new ResponseEntity<>("Tipo de movimiento eliminado exitosamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar el tipo de movimiento", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
