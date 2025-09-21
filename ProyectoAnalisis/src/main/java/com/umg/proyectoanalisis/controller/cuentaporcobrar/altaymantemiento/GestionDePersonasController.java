package com.umg.proyectoanalisis.controller.cuentaporcobrar.altaymantemiento;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.entity.cuentaporcobrar.Persona;
import com.umg.proyectoanalisis.repository.cuentaporcobrar.altaymantenimiento.PersonaRepository;



@RestController
@RequestMapping("/api/auth")
public class GestionDePersonasController {

	@Autowired
    private PersonaRepository personaRepository;
	
    @GetMapping("/personas-paginado")
    public Page<Persona> getAllPersonasPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
    	return personaRepository.findAll(PageRequest.of(page, size));

    }
}
