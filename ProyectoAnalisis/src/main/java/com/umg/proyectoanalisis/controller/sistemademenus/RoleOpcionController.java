package com.umg.proyectoanalisis.controller.sistemademenus;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
 public List<RoleOpcion> obtenerOpcionesRol(){
    return roleOpcionRepository.findAll();
 }

 @PostMapping("/asignar-opcion-rol")
 public RoleOpcion crearOpcionRol(@RequestBody RoleOpcion roleOpcion){
    roleOpcion.setFechaCreacion(LocalDateTime.now());
    roleOpcion.setUsuarioCreacion("Administrador");
    return roleOpcionRepository.save(roleOpcion);
 }

  @PutMapping("/actualizar-opcion-rol")
 public RoleOpcion actualizarOpcionRol(@RequestBody RoleOpcion roleOpcion){
    roleOpcion.setFechaModificacion(LocalDateTime.now());
    roleOpcion.setUsuarioModificacion("Administrador");
    return roleOpcionRepository.save(roleOpcion);
 }

 @DeleteMapping("/eliminar-opcion-rol")
 public void eliminarOpcionRol(@RequestParam RoleOpcionId idRoleOpcion){
 roleOpcionRepository.deleteById(idRoleOpcion);
 }

 //Faltan Imprimir y Exportar


}
