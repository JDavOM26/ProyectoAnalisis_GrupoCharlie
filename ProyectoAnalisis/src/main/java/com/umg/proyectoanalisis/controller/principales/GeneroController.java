package com.umg.proyectoanalisis.controller.principales;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

import com.umg.proyectoanalisis.entity.principales.Genero;
import com.umg.proyectoanalisis.repository.principales.GeneroRepository;

import java.util.List;


@RestController
@RequestMapping("/api/auth")
public class GeneroController {

     @Autowired
     GeneroRepository generoRepository;

     @GetMapping("/generos")
     public List<Genero> getAllGeneros(){
        return generoRepository.findAll();
     }
}
