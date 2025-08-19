package com.umg.proyectoanalisis.controller.sistemademenus;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.umg.proyectoanalisis.entity.sistemademenus.Modulo;
import com.umg.proyectoanalisis.repository.sistemademenus.ModuloRepository;


@RestController
@RequestMapping("/api/auth")
public class ModuloController {
@Autowired
ModuloRepository moduloRepository;
    
    @GetMapping("/modulos")
    public List<Modulo> getModulos(){
        return moduloRepository.findAll();
    }
}
