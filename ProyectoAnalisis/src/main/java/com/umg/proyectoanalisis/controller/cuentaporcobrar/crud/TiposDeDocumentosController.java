package com.umg.proyectoanalisis.controller.cuentaporcobrar.crud;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.umg.proyectoanalisis.dto.requestdto.postdtos.NombreIdUsuarioDto;
import com.umg.proyectoanalisis.entity.cuentaporcobrar.TipoDocumento;
import com.umg.proyectoanalisis.repository.cuentaporcobrar.crud.TiposDeDocumentosRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth/tiposDocumentos")
public class TiposDeDocumentosController {

    @Autowired
    private TiposDeDocumentosRepository tiposDeDocumentosRepository;

    @GetMapping("/obtener-tipos")
    public ResponseEntity<List<TipoDocumento>> obtenerTipos() {
        try {
            List<TipoDocumento> lista = tiposDeDocumentosRepository.findAll();
            if (lista.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(lista, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/crear-tipo")
    public ResponseEntity<TipoDocumento> crearTipo(@Valid @RequestBody NombreIdUsuarioDto tipoDto) {
        try {
            TipoDocumento nuevoTipo = new TipoDocumento();
            nuevoTipo.setNombre(tipoDto.getNombre());
            nuevoTipo.setFechaCreacion(LocalDateTime.now());
            nuevoTipo.setUsuarioCreacion(tipoDto.getIdUsuario());
            TipoDocumento nuevo = tiposDeDocumentosRepository.save(nuevoTipo);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/actualizar-tipo/{id}")
    public ResponseEntity<TipoDocumento> actualizarTipo(@PathVariable Integer id,
            @Valid @RequestBody NombreIdUsuarioDto tipoDto) {
        try {
            TipoDocumento existente = tiposDeDocumentosRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tipo de documento no encontrado con id: " + id));

            existente.setNombre(tipoDto.getNombre());
            existente.setFechaModificacion(LocalDateTime.now());
            existente.setUsuarioModificacion(tipoDto.getIdUsuario());
            TipoDocumento actualizado = tiposDeDocumentosRepository.save(existente);
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
            if (!tiposDeDocumentosRepository.existsById(id)) {
                return new ResponseEntity<>("Tipo de documento no encontrado con id: " + id, HttpStatus.NOT_FOUND);
            }
            tiposDeDocumentosRepository.deleteById(id);
            return new ResponseEntity<>("Tipo de documento eliminado exitosamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar el tipo de documento", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
