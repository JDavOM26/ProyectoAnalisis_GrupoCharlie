package com.umg.proyectoanalisis.controller.cuentaporcobrar;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umg.proyectoanalisis.service.DashboardService;

@RestController
@RequestMapping("/api/auth/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/estadisticas-completas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasCompletas() {
        try {
            Map<String, Object> estadisticas = dashboardService.obtenerEstadisticasCompletas();
            return new ResponseEntity<>(estadisticas, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}