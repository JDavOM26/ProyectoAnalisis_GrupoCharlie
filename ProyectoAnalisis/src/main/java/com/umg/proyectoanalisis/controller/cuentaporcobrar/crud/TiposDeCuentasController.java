package com.umg.proyectoanalisis.controller.cuentaporcobrar.crud;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.umg.proyectoanalisis.dto.requestdto.postdtos.NombreIdUsuarioDto;
import com.umg.proyectoanalisis.entity.cuentaporcobrar.TipoSaldoCuenta;
import com.umg.proyectoanalisis.repository.cuentaporcobrar.crud.TiposDeCuentasRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth/tiposCuentas")
public class TiposDeCuentasController {

    @Autowired
    private TiposDeCuentasRepository tiposDeCuentasRepository;

    @GetMapping("/obtener-tipos")
    public ResponseEntity<List<TipoSaldoCuenta>> obtenerTipos() {
        try {
            List<TipoSaldoCuenta> lista = tiposDeCuentasRepository.findAll();
            if (lista.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(lista, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/crear-tipo")
    public ResponseEntity<TipoSaldoCuenta> crearTipo(@Valid @RequestBody NombreIdUsuarioDto tipoDto) {
        try {
            TipoSaldoCuenta nuevoTipo = new TipoSaldoCuenta();
            nuevoTipo.setNombre(tipoDto.getNombre());
            nuevoTipo.setFechaCreacion(LocalDateTime.now());
            nuevoTipo.setUsuarioCreacion(tipoDto.getIdUsuario());
            TipoSaldoCuenta nuevo = tiposDeCuentasRepository.save(nuevoTipo);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/actualizar-tipo/{id}")
    public ResponseEntity<TipoSaldoCuenta> actualizarTipo(@PathVariable Integer id,
            @Valid @RequestBody NombreIdUsuarioDto tipoDto) {
        try {
            TipoSaldoCuenta existente = tiposDeCuentasRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tipo no encontrado con id: " + id));

            existente.setNombre(tipoDto.getNombre());
            existente.setFechaModificacion(LocalDateTime.now());
            existente.setUsuarioModificacion(tipoDto.getIdUsuario());
            TipoSaldoCuenta actualizado = tiposDeCuentasRepository.save(existente);
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
            if (!tiposDeCuentasRepository.existsById(id)) {
                return new ResponseEntity<>("Tipo no encontrado con id: " + id, HttpStatus.NOT_FOUND);
            }
            tiposDeCuentasRepository.deleteById(id);
            return new ResponseEntity<>("Tipo eliminado exitosamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar el tipo", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
