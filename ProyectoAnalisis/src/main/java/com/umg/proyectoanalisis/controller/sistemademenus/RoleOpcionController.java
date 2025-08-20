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
import com.umg.proyectoanalisis.entity.sistemademenus.RoleOpcion;
import com.umg.proyectoanalisis.entity.sistemademenus.RoleOpcionId;
import com.umg.proyectoanalisis.repository.sistemademenus.RoleOpcionRepository;

@RestController
@RequestMapping("/api/auth")
public class RoleOpcionController {
   @Autowired
   RoleOpcionRepository roleOpcionRepository;

   
   @GetMapping("/roleOpcion")
   public ResponseEntity<List<RoleOpcion>> obtenerOpcionesRol() {
      try {
         List<RoleOpcion> roleOpciones = roleOpcionRepository.findAll();
         if (roleOpciones.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
         }
         return new ResponseEntity<>(roleOpciones, HttpStatus.OK); 
      } catch (Exception e) {
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
      }
   }

   
   @PostMapping("/asignar-opcion-rol")
   public ResponseEntity<RoleOpcion> crearOpcionRol(@RequestBody RoleOpcion roleOpcion) {
      try {
         if (roleOpcion.getIdRole() == null || roleOpcion.getIdOpcion() == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); 
         }
         roleOpcion.setFechaCreacion(LocalDateTime.now());
         roleOpcion.setUsuarioCreacion("Administrador");
         RoleOpcion roleOpcionGuardada = roleOpcionRepository.save(roleOpcion);
         return new ResponseEntity<>(roleOpcionGuardada, HttpStatus.CREATED); 
      } catch (Exception e) {
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
      }
   }

  
   @PutMapping("/actualizar-opcion-rol")
   public ResponseEntity<RoleOpcion> actualizarOpcionRol(@RequestBody RoleOpcion roleOpcion) {
      try {
         RoleOpcionId id = new RoleOpcionId();
         id.setIdRole(roleOpcion.getIdRole());
         id.setIdOpcion(roleOpcion.getIdOpcion());

         RoleOpcion roleOpcionExistente = roleOpcionRepository.findById(id)
               .orElseThrow(() -> new RuntimeException("Rol-Opción no encontrado con id: " + id));
         roleOpcionExistente.setAlta(roleOpcion.getAlta());
         roleOpcionExistente.setBaja(roleOpcion.getBaja());
         roleOpcionExistente.setCambio(roleOpcion.getCambio());
         roleOpcionExistente.setExportar(roleOpcion.getExportar());
         roleOpcionExistente.setImprimir(roleOpcion.getImprimir());
         roleOpcionExistente.setFechaModificacion(LocalDateTime.now());
         roleOpcionExistente.setUsuarioModificacion("Administrador");
         RoleOpcion roleOpcionActualizada = roleOpcionRepository.save(roleOpcionExistente);
         return new ResponseEntity<>(roleOpcionActualizada, HttpStatus.OK); 
      } catch (RuntimeException e) {
         return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); 
      } catch (Exception e) {
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
      }
   }


   @DeleteMapping("/eliminar-opcion-rol")
   public ResponseEntity<String> eliminarOpcionRol(@RequestParam Integer idRole, @RequestParam Integer idOpcion) {
      try {
         RoleOpcionId id = new RoleOpcionId();
         id.setIdRole(idRole);
         id.setIdOpcion(idOpcion);

         if (!roleOpcionRepository.existsById(id)) {
            return new ResponseEntity<>("Rol-Opción no encontrado con id: " + id, HttpStatus.NOT_FOUND); 

         }
         roleOpcionRepository.deleteById(id);
         return new ResponseEntity<>("Rol-Opción eliminado exitosamente", HttpStatus.OK); 
      } catch (Exception e) {
         return new ResponseEntity<>("Error al eliminar el Rol-Opción", HttpStatus.INTERNAL_SERVER_ERROR); 
      }
   }

   // Faltan Imprimir y Exportar

}
