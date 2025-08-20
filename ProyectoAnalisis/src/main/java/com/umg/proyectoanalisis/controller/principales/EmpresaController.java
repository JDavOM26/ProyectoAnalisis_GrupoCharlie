package com.umg.proyectoanalisis.controller.principales;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.umg.proyectoanalisis.entity.principales.Empresa;
import com.umg.proyectoanalisis.service.EmpresaService;

@RestController
@RequestMapping("/api/noauth/empresa")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @GetMapping("/{idEmpresa}")
    public ResponseEntity<Empresa> obtenerEmpresa(@PathVariable int idEmpresa) {
        try {
            Empresa empresa = empresaService.findById(idEmpresa);
            return ResponseEntity.ok(empresa);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
