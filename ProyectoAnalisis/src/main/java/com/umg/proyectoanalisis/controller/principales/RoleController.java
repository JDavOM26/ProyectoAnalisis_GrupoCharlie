package com.umg.proyectoanalisis.controller.principales;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.entity.principales.Role;
import com.umg.proyectoanalisis.repository.principales.RoleRepository;

@RestController
@RequestMapping("/api/auth")
public class RoleController {
   @Autowired
   RoleRepository roleRepository;
    @GetMapping("/obtener_roles")
    public List<Role> obtenerRoles(){
    return roleRepository.findAll();
    }

    @PostMapping("/crear_rol")
    public Role crearRole(@RequestBody Role role){
    role.setFechaCreacion(LocalDateTime.now());
    role.setUsuarioCreacion("Administrador");
     return roleRepository.save(role);
    }

}
