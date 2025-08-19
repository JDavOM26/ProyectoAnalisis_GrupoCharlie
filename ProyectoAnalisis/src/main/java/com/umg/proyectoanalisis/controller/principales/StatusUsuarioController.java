package com.umg.proyectoanalisis.controller.principales;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.entity.principales.StatusUsuario;
import com.umg.proyectoanalisis.repository.principales.StatusUsuarioRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
public class StatusUsuarioController {
    
    @Autowired
    StatusUsuarioRepository statusUsuarioRepository;
    @GetMapping("/status")
    public List<StatusUsuario> getStatusUsuario(){
        return statusUsuarioRepository.findAll();
    }
    
    @PostMapping("/crearStatus")
    public StatusUsuario postStatusUsuario(@RequestBody StatusUsuario statusUsuario) {
        
        return statusUsuarioRepository.save(statusUsuario);
    }
    
}
