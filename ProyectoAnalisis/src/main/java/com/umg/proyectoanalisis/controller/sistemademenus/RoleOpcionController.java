package com.umg.proyectoanalisis.controller.sistemademenus;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.entity.sistemademenus.RoleOpcion;
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

 @PostMapping("/asignarOpcionRol")
 public RoleOpcion crearOpcionRol(@RequestBody RoleOpcion roleOpcion){
    roleOpcion.setFechaCreacion(LocalDateTime.now());
    roleOpcion.setUsuarioCreacion("Administrador");
    return roleOpcionRepository.save(roleOpcion);
 }

}
