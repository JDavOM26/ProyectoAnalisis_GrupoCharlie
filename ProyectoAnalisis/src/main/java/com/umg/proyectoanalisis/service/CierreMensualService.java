package com.umg.proyectoanalisis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.umg.proyectoanalisis.repository.movCuenta.CierreMensualRepository;

import jakarta.transaction.Transactional;

@Service
public class CierreMensualService {

    @Autowired
    private CierreMensualRepository cierreMensualRepository;

     public String ejecutarCierreMensual(String usuario) {
        Integer codigo = cierreMensualRepository.ejecutarCierreMensual(usuario);

        return switch (codigo) {
            case 1 -> "Cierre mensual ejecutado correctamente.";
            case 2 -> "No existe un periodo abierto para cierre.";
            case 3 -> "No hay registros de saldo para consolidar.";
            default -> "Error al ejecutar el cierre mensual.";
        };
    }
}