package com.umg.proyectoAnalasis.controller.ControladoresPrincipales;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
public class GeneroController {

     @GetMapping("/test")
    public String respuesta(){
        String respuesta = "Test de autorizacion";
        return  respuesta;
    }
}
