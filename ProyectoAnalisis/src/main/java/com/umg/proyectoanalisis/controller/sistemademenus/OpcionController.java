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

import com.umg.proyectoanalisis.dto.requestdto.postdtos.OpcionPostDto;
import com.umg.proyectoanalisis.entity.sistemademenus.Menu;
import com.umg.proyectoanalisis.entity.sistemademenus.Opcion;
import com.umg.proyectoanalisis.repository.sistemademenus.MenuRepository;
import com.umg.proyectoanalisis.repository.sistemademenus.OpcionRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class OpcionController {
    @Autowired
    OpcionRepository opcionRepository;

    @Autowired
    MenuRepository menuRepository;
   
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
    public ResponseEntity<Opcion> crearOpcion(@Valid @RequestBody OpcionPostDto opcionDto) {
        try {
            Opcion opcion = new Opcion();
            Menu menu = menuRepository.findById(opcionDto.getIdMenu())
             .orElseThrow(() -> new RuntimeException("Menú no encontrado con id"));

            opcion.setNombre(opcionDto.getNombre());
            opcion.setMenu(menu);
            opcion.setOrdenMenu(opcionDto.getOrdenMenu());
            opcion.setFechaCreacion(LocalDateTime.now());
            opcion.setPagina(opcionDto.getPagina());
            opcion.setUsuarioCreacion(opcionDto.getIdUsuario());
            Opcion opcionCreado = opcionRepository.save(opcion);
            return new ResponseEntity<>(opcionCreado, HttpStatus.CREATED); 
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }

  
    @PutMapping("/actualizar-opcion/{idOpcion}")
    public ResponseEntity<Opcion> actualizarOpcion(@PathVariable Integer idOpcion, @Valid @RequestBody OpcionPostDto opcionDto) {
        try {
            Opcion opcionExistente = opcionRepository.findById(idOpcion)
                    .orElseThrow(() -> new RuntimeException("Opción no encontrada con id"));
           
            opcionExistente.setNombre(opcionDto.getNombre());
            opcionExistente.setOrdenMenu(opcionDto.getOrdenMenu());
            opcionExistente.setPagina(opcionDto.getPagina());
            opcionExistente.setFechaModificacion(LocalDateTime.now());
            opcionExistente.setUsuarioModificacion(opcionDto.getIdUsuario());
             Opcion opcionCreado = opcionRepository.save(opcionExistente);
            return new ResponseEntity<>(opcionCreado, HttpStatus.OK); 
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
