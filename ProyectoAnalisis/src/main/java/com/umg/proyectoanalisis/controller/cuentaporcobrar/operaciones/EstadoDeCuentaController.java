package com.umg.proyectoanalisis.controller.cuentaporcobrar.operaciones;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.service.ConsultasBusquedasService;

@RestController
@RequestMapping("/api/auth")
public class EstadoDeCuentaController {
	@Autowired
	private ConsultasBusquedasService personaService;
	
	@GetMapping("/obtener-movimiento-cuenta")
    public ResponseEntity<Map<String, Object>> obtenerMovimientoCuenta(
            @RequestParam String valorBusqueda,
            @RequestParam String tipo) {
        try {
            Map<String, Object> movimiento = personaService.buscarMovimientoCuenta(valorBusqueda, tipo);
            if (movimiento.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(movimiento, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
