package com.umg.proyectoanalisis.controller.sistemademenus;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.dto.requestdto.postdtos.ModuloPostDto;
import com.umg.proyectoanalisis.entity.sistemademenus.Modulo;
import com.umg.proyectoanalisis.repository.sistemademenus.ModuloRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class ModuloController {
    @Autowired
    ModuloRepository moduloRepository;

    @GetMapping("/modulos")
    public ResponseEntity<List<Modulo>> obtenerModulos() {
        try {
            List<Modulo> modulos = moduloRepository.findAll();
            if (modulos.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(modulos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/crear-modulo")
    public ResponseEntity<Modulo> crearModulo(@Valid @RequestBody ModuloPostDto moduloDto) {
        try {
            Modulo modulo = new Modulo();
            modulo.setNombre(moduloDto.getNombre());
            modulo.setOrdenMenu(moduloDto.getOrdenMenu());
            modulo.setFechaCreacion(LocalDateTime.now());
            modulo.setUsuarioCreacion(moduloDto.getIdUsuario());
            Modulo moduloGuardado = moduloRepository.save(modulo);
            return new ResponseEntity<>(moduloGuardado, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/actualizar-modulo/{idModulo}")
    public ResponseEntity<Modulo> actualizarModulo(@PathVariable Integer idModulo, @Valid @RequestBody ModuloPostDto moduloDto) {
        try {
            Modulo moduloExistente = moduloRepository.findById(idModulo)
                    .orElseThrow(() -> new RuntimeException("Módulo no encontrado con id"));
          
            moduloExistente.setNombre(moduloDto.getNombre());
            moduloExistente.setOrdenMenu(moduloDto.getOrdenMenu());
            moduloExistente.setFechaModificacion(LocalDateTime.now());
            moduloExistente.setUsuarioModificacion(moduloDto.getIdUsuario());
             Modulo moduloGuardado = moduloRepository.save(moduloExistente);
            return new ResponseEntity<>(moduloGuardado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/borrar-modulo")
    public ResponseEntity<String> eliminarModulo(@RequestParam Integer idModulo) {
        try {
            if (!moduloRepository.existsById(idModulo)) {
                return new ResponseEntity<>("Módulo no encontrado con id: " + idModulo, HttpStatus.NOT_FOUND);
            }
            moduloRepository.deleteById(idModulo);
            return new ResponseEntity<>("Módulo eliminado exitosamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar el módulo", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Faltan Imprimir y Exportar

}
