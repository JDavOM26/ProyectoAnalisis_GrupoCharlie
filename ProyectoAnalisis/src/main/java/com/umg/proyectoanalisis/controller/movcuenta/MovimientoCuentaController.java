package com.umg.proyectoanalisis.controller.movcuenta;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.dto.MovimientoCuentaRequest;
import com.umg.proyectoanalisis.service.MovimientoCuentaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/registrar-movimento")
@RequiredArgsConstructor
public class MovimientoCuentaController {

    private final MovimientoCuentaService movimientoCuentaService;

    @PostMapping
    public ResponseEntity<?> registrarMovimiento(@RequestBody MovimientoCuentaRequest request){
        try{
            movimientoCuentaService.registrarMovimiento(request);
            return ResponseEntity.ok("Movimiento registrado correctamente");
        } catch (Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
