package com.umg.proyectoanalisis.controller.principales;
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

import com.umg.proyectoanalisis.entity.principales.Role;
import com.umg.proyectoanalisis.repository.principales.RoleRepository;

@RestController
@RequestMapping("/api/auth")
public class RoleController {
   @Autowired
   RoleRepository roleRepository;

    @GetMapping("/obtener-roles")
    public List<Role> obtenerRoles(){
    return roleRepository.findAll();
    }

    @PostMapping("/crear-rol")
    public Role crearRol(@RequestBody Role role){
    role.setFechaCreacion(LocalDateTime.now());
    role.setUsuarioCreacion("Administrador");
     return roleRepository.save(role);
    }

     @PutMapping("/actualizar-rol")
    public Role actualizarRol(@RequestBody Role role){
    role.setFechaModificacion(LocalDateTime.now());
    role.setUsuarioModificacion("Administrador");
     return roleRepository.save(role);
    }

    @DeleteMapping("/borrar-rol")
    public void borrarRol(@RequestParam Integer idRol){
        roleRepository.deleteById(idRol);
    }

     //Faltan Imprimir y Exportar

}
