package com.umg.proyectoanalisis.controller.principales;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

import com.umg.proyectoanalisis.entity.principales.Genero;
import com.umg.proyectoanalisis.repository.principales.GeneroRepository;

import java.time.LocalDateTime;
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

     @PostMapping("/crear-genero")
     public Genero crearGenero(@RequestBody Genero genero){
      Genero g = new Genero();
       g.setNombre(genero.getNombre());
       g.setFechaCreacion(LocalDateTime.now());
       g.setUsuarioCreacion("Administrador");
      return generoRepository.save(g);
     }

     @PutMapping("/actualizar-genero")
     public Genero actualizarGenero(@RequestBody Genero genero){
      Genero generoExistente = generoRepository.findById(genero.getIdGenero())
      .orElseThrow(() -> new RuntimeException("Género no encontrado con id: "+genero.getIdGenero()));


       generoExistente.setNombre(genero.getNombre());
       generoExistente.setFechaModificacion(LocalDateTime.now());
       generoExistente.setUsuarioModificacion("Administrador");
      return generoRepository.save(generoExistente);
     }


     @DeleteMapping("/borrar-genero")
     public void borrarGenero(@RequestParam Integer idGenero){
      generoRepository.deleteById(idGenero);
     }

     //Faltan Imprimir y Exportar
}
