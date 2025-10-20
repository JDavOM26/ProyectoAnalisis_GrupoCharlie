package com.umg.proyectoanalisis.controller.movcuenta;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.service.CierreMensualService;

@RestController
@RequestMapping("/api/cierre")
public class CierreMensualController {
    @Autowired
    private CierreMensualService cierreMensualService;

    @PostMapping("/ejecutar")
    public ResponseEntity<Map<String, Object>> ejecutarCierre(@RequestParam String usuario) {
        Map<String, Object> response = new HashMap<>();
        try {
            String mensaje = cierreMensualService.ejecutarCierreMensual(usuario);
            response.put("success", true);
            response.put("message", mensaje);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al ejecutar el cierre: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
