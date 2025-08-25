package com.umg.proyectoanalisis.controller.principales;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.umg.proyectoanalisis.dto.requestdto.postdtos.NombreIdUsuarioDto;
import com.umg.proyectoanalisis.entity.principales.Genero;
import com.umg.proyectoanalisis.repository.principales.GeneroRepository;

import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class GeneroController {

   @Autowired
   GeneroRepository generoRepository;

   @GetMapping("/generos")
   public ResponseEntity<List<Genero>> obtenerGeneros() {
      try {
         List<Genero> generos = generoRepository.findAll();
         if (generos.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
         }
         return new ResponseEntity<>(generos, HttpStatus.OK);
      } catch (Exception e) {
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @PostMapping("/crear-genero")
   public ResponseEntity<Genero> crearGenero(@RequestBody NombreIdUsuarioDto generoDto) {
      try {
         if (generoDto.getNombre() == null || generoDto.getNombre().isEmpty()
          && generoDto.getIdUsuario() == null || generoDto.getIdUsuario().isEmpty()) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); 
         }
         Genero nuevoGenero = new Genero();
         nuevoGenero.setNombre(generoDto.getNombre());
         nuevoGenero.setFechaCreacion(LocalDateTime.now());
         nuevoGenero.setUsuarioCreacion(generoDto.getIdUsuario());
         Genero generoResponse = generoRepository.save(nuevoGenero);
         return new ResponseEntity<>(generoResponse, HttpStatus.CREATED); 
      } catch (Exception e) {
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
      }
   }

   @PutMapping("/actualizar-genero/{idGenero}")
   public ResponseEntity<Genero> actualizarGenero(@PathVariable Integer idGenero,@Valid @RequestBody NombreIdUsuarioDto generoDto) {
      try {
         Genero generoExistente = generoRepository.findById(idGenero)
               .orElseThrow(() -> new RuntimeException("Género no encontrado con id"));
         
         generoExistente.setNombre(generoDto.getNombre());
         generoExistente.setFechaModificacion(LocalDateTime.now());
         generoExistente.setUsuarioModificacion(generoDto.getIdUsuario());
          Genero generoResponse = generoRepository.save(generoExistente);
         return new ResponseEntity<>(generoResponse, HttpStatus.OK);
      } catch (RuntimeException e) {
         return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); 
      } catch (Exception e) {
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
      }
   }

  
   @DeleteMapping("/borrar-genero")
   public ResponseEntity<String> borrarGenero(@RequestParam Integer idGenero) {
      try {
         if (!generoRepository.existsById(idGenero)) {
            return new ResponseEntity<>("Género no encontrado con id: " + idGenero, HttpStatus.NOT_FOUND); 
                                                                                                          
         }
         generoRepository.deleteById(idGenero);
         return new ResponseEntity<>("Género eliminado exitosamente", HttpStatus.OK); 
      } catch (Exception e) {
         return new ResponseEntity<>("Error al eliminar el género", HttpStatus.INTERNAL_SERVER_ERROR); 
                                                                                                       
      }
   }

   // Faltan Imprimir y Exportar
}
