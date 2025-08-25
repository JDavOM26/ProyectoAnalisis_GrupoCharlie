package com.umg.proyectoanalisis.controller.principales;

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

import com.umg.proyectoanalisis.dto.requestdto.postdto.NombreIdUsuarioDto;
import com.umg.proyectoanalisis.entity.principales.Role;
import com.umg.proyectoanalisis.repository.principales.RoleRepository;

@RestController
@RequestMapping("/api/auth")
public class RoleController {
  @Autowired
  RoleRepository roleRepository;


  @GetMapping("/obtener-roles")
  public ResponseEntity<List<Role>> obtenerRoles() {
    try {
      List<Role> roles = roleRepository.findAll();
      if (roles.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
      }
      return new ResponseEntity<>(roles, HttpStatus.OK); 
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
    }
  }


  @PostMapping("/crear-rol")
  public ResponseEntity<Role> crearRol(@RequestBody NombreIdUsuarioDto roleDto) {
    try {
      if (roleDto.getNombre() == null || roleDto.getNombre().isEmpty() && 
      roleDto.getIdUsuario() == null || roleDto.getIdUsuario().isEmpty()) {
        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); 
      }
      Role role = new Role();
      role.setNombre(roleDto.getNombre());
      role.setFechaCreacion(LocalDateTime.now());
      role.setUsuarioCreacion(roleDto.getIdUsuario());
      Role rolGuardado = roleRepository.save(role);
      return new ResponseEntity<>(rolGuardado, HttpStatus.CREATED); 
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
    }
  }

  
  @PutMapping("/actualizar-rol")
  public ResponseEntity<Role> actualizarRol(@RequestBody Role role) {
    try {
      Role roleExistente = roleRepository.findById(role.getIdRole())
          .orElseThrow(() -> new RuntimeException("Rol no encontrado con id: " + role.getIdRole()));
      if (role.getNombre() == null || role.getNombre().isEmpty()) {
        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); 
      }
      roleExistente.setNombre(role.getNombre());
      roleExistente.setFechaModificacion(LocalDateTime.now());
      roleExistente.setUsuarioModificacion("Administrador");
      Role rolActualizado = roleRepository.save(roleExistente);
      return new ResponseEntity<>(rolActualizado, HttpStatus.OK); 
    } catch (RuntimeException e) {
      return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); 
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); 
    }
  }

 
  @DeleteMapping("/borrar-rol")
  public ResponseEntity<String> borrarRol(@RequestParam Integer idRol) {
    try {
      if (!roleRepository.existsById(idRol)) {
        return new ResponseEntity<>("Rol no encontrado con id: " + idRol, HttpStatus.NOT_FOUND); 
      }
      roleRepository.deleteById(idRol);
      return new ResponseEntity<>("Rol eliminado exitosamente", HttpStatus.OK); 
    } catch (Exception e) {
      return new ResponseEntity<>("Error al eliminar el rol", HttpStatus.INTERNAL_SERVER_ERROR); 
    }
  }

  // Faltan Imprimir y Exportar

}
