package com.umg.proyectoanalisis.controller.sistemademenus;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.umg.proyectoanalisis.entity.sistemademenus.Opcion;
import com.umg.proyectoanalisis.repository.sistemademenus.OpcionRepository;

@RestController
@RequestMapping("/api/auth")
public class OpcionController {
    @Autowired
    OpcionRepository opcionRepository;

   
    @GetMapping("/opcion")
    public ResponseEntity<List<Opcion>> obtenerOpciones() {
        try {
            List<Opcion> opciones = opcionRepository.findAll();
            if (opciones.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
            }
            return new ResponseEntity<>(opciones, HttpStatus.OK); 
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }

    
    @PostMapping("/crear-opcion")
    public ResponseEntity<Opcion> crearOpcion(@RequestBody Opcion opcion) {
        try {
            if (opcion.getNombre() == null || opcion.getNombre().isEmpty() ||
                    opcion.getOrdenMenu() == null || opcion.getPagina() == null || opcion.getPagina().isEmpty()) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); 
            }
            opcion.setFechaCreacion(LocalDateTime.now());
            opcion.setUsuarioCreacion("Administrador");
            Opcion opcionGuardada = opcionRepository.save(opcion);
            return new ResponseEntity<>(opcionGuardada, HttpStatus.CREATED); 
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }

  
    @PutMapping("/actualizar-opcion")
    public ResponseEntity<Opcion> actualizarOpcion(@RequestBody Opcion opcion) {
        try {
            Opcion opcionExistente = opcionRepository.findById(opcion.getIdOpcion())
                    .orElseThrow(() -> new RuntimeException("Opción no encontrada con id: " + opcion.getIdOpcion()));
            if (opcion.getNombre() == null || opcion.getNombre().isEmpty() ||
                    opcion.getOrdenMenu() == null || opcion.getPagina() == null || opcion.getPagina().isEmpty()) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); 
            }
            opcionExistente.setNombre(opcion.getNombre());
            opcionExistente.setOrdenMenu(opcion.getOrdenMenu());
            opcionExistente.setPagina(opcion.getPagina());
            opcionExistente.setFechaModificacion(LocalDateTime.now());
            opcionExistente.setUsuarioModificacion("Administrador");
            Opcion opcionActualizada = opcionRepository.save(opcionExistente);
            return new ResponseEntity<>(opcionActualizada, HttpStatus.OK); 
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); 
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }

    
    @DeleteMapping("/borrar-opcion")
    public ResponseEntity<String> eliminarOpcion(@RequestParam Integer idOpcion) {
        try {
            if (!opcionRepository.existsById(idOpcion)) {
                return new ResponseEntity<>("Opción no encontrada con id: " + idOpcion, HttpStatus.NOT_FOUND); 
                                                                                                               
                                                                                                              
            }
            opcionRepository.deleteById(idOpcion);
            return new ResponseEntity<>("Opción eliminada exitosamente", HttpStatus.OK); 
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar la opción", HttpStatus.INTERNAL_SERVER_ERROR); 
                                                                                                          
        }
    }
    // Faltan Imprimir y Exportar

}
