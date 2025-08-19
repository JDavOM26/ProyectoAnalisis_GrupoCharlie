package com.umg.proyectoanalisis.controller.sistemademenus;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.entity.sistemademenus.Opcion;
import com.umg.proyectoanalisis.repository.sistemademenus.OpcionRepository;

@RestController
@RequestMapping("/api/auth")
public class OpcionController {
@Autowired
OpcionRepository opcionRepository;

@GetMapping("/opcion")
public List<Opcion> obtenerOpciones(){
    return opcionRepository.findAll();
}

@PostMapping("/crearOpcion")
public Opcion crearOpcionRol(@RequestBody Opcion opcion){
    opcion.setFechaCreacion(LocalDateTime.now());
    opcion.setUsuarioCreacion("Administrador");
    return opcionRepository.save(opcion);
}
}
