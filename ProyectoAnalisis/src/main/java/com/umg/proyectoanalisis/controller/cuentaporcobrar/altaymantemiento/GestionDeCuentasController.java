package com.umg.proyectoanalisis.controller.cuentaporcobrar.altaymantemiento;

import com.umg.proyectoanalisis.entity.cuentaporcobrar.SaldoCuenta;
import com.umg.proyectoanalisis.entity.cuentaporcobrar.Persona;
import com.umg.proyectoanalisis.repository.cuentaporcobrar.altaymantenimiento.SaldoCuentaRepository;
import com.umg.proyectoanalisis.repository.cuentaporcobrar.altaymantenimiento.PersonaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class GestionDeCuentasController {

    @Autowired
    private SaldoCuentaRepository saldoCuentaRepository;

    @Autowired
    private PersonaRepository personaRepository;

    // --- OBTENER TODAS LAS CUENTAS PAGINADAS ---
    @GetMapping("/obtener/saldos-paginado")
    public Page<SaldoCuenta> obtenerSaldosPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return saldoCuentaRepository.findAll(PageRequest.of(page, size));
    }

    // --- OBTENER SALDO POR ID ---
    @GetMapping("/obtener/saldos-persona/{idPersona}")
    public ResponseEntity<?> obtenerSaldosPorPersona(@PathVariable Integer idPersona) {
        List<SaldoCuenta> saldos = saldoCuentaRepository.findByIdPersona(idPersona);
        if (saldos.isEmpty()) {
            return ResponseEntity.status(404)
                    .body("No se encontraron saldos para la persona con ID: " + idPersona);
        }
        return ResponseEntity.ok(saldos);
    }

    // --- CREAR NUEVO SALDO DE CUENTA ---
    @PostMapping("/crear/saldos")
    public ResponseEntity<?> crearSaldoCuenta(@RequestBody SaldoCuenta saldoCuenta) {
        // Validar que usuarioCreacion no sea nulo
        if (saldoCuenta.getUsuarioCreacion() == null || saldoCuenta.getUsuarioCreacion().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El campo 'usuarioCreacion' es obligatorio.");
        }
        // Validar que la persona exista
        Optional<Persona> persona = personaRepository.findById(saldoCuenta.getIdPersona());
        if (persona.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("No existe una persona con IdPersona = " + saldoCuenta.getIdPersona());
        }
        // Evitar crear si ya existe (según IdSaldoCuenta)
        if (saldoCuenta.getIdSaldoCuenta() != null
                && saldoCuentaRepository.existsById(saldoCuenta.getIdSaldoCuenta())) {
            return ResponseEntity.badRequest()
                    .body("Ya existe un registro con IdSaldoCuenta = " + saldoCuenta.getIdSaldoCuenta());
        }
        saldoCuenta.setIdSaldoCuenta(null); // Aseguramos que se genere uno nuevo
        saldoCuenta.setFechaCreacion(LocalDateTime.now());
        SaldoCuenta nuevoSaldo = saldoCuentaRepository.save(saldoCuenta);
        return ResponseEntity.ok(nuevoSaldo);
    }

    // --- ACTUALIZAR SALDO DE CUENTA ---
    @PutMapping("/actualizar/saldos/{id}")
    public ResponseEntity<?> actualizarSaldoCuenta(@PathVariable Integer id,
            @RequestBody SaldoCuenta saldoActualizado) {
        if (saldoActualizado.getUsuarioModificacion() == null
                || saldoActualizado.getUsuarioModificacion().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El campo 'usuarioModificacion' es obligatorio.");
        }
        Optional<SaldoCuenta> saldoOpt = saldoCuentaRepository.findById(id);
        if (saldoOpt.isEmpty()) {
            return ResponseEntity.status(404).body("No se encontró el saldo con ID: " + id);
        }
        SaldoCuenta saldoExistente = saldoOpt.get();
        // Actualizamos campos editables
        saldoExistente.setIdPersona(saldoActualizado.getIdPersona());
        saldoExistente.setIdStatusCuenta(saldoActualizado.getIdStatusCuenta());
        saldoExistente.setIdTipoSaldoCuenta(saldoActualizado.getIdTipoSaldoCuenta());
        saldoExistente.setSaldoAnterior(saldoActualizado.getSaldoAnterior());
        saldoExistente.setDebitos(saldoActualizado.getDebitos());
        saldoExistente.setCreditos(saldoActualizado.getCreditos());
        saldoExistente.setFechaModificacion(LocalDateTime.now());
        saldoExistente.setUsuarioModificacion(saldoActualizado.getUsuarioModificacion());
        SaldoCuenta saldoGuardado = saldoCuentaRepository.save(saldoExistente);
        return ResponseEntity.ok(saldoGuardado);
    }

    // --- ELIMINAR SALDO DE CUENTA ---
    @DeleteMapping("/eliminar/saldos/{id}")
    public ResponseEntity<?> eliminarSaldoCuenta(@PathVariable Integer id) {
        Optional<SaldoCuenta> saldoOpt = saldoCuentaRepository.findById(id);
        if (saldoOpt.isEmpty()) {
            return ResponseEntity.status(404).body("No se encontró el saldo con ID: " + id);
        }
        try {
            saldoCuentaRepository.deleteById(id);
            return ResponseEntity.ok("Saldo de cuenta eliminado correctamente.");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(409).body(
                    "No se puede eliminar el saldo con ID " + id +
                            " porque tiene movimientos u otros registros relacionados en la base de datos.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    "Ocurrió un error inesperado al eliminar el saldo: " + e.getMessage());
        }
    }

    // --- CALCULAR SALDO ACTUAL ---
    @GetMapping("/saldo-cuenta/{id}/calcular-saldo")
    public ResponseEntity<?> calcularSaldoActual(@PathVariable Integer id) {
        Optional<SaldoCuenta> saldoOpt = saldoCuentaRepository.findById(id);
        if (saldoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("No se encontró el saldo con ID " + id);
        }
        SaldoCuenta cuenta = saldoOpt.get();
        BigDecimal saldoAnterior = cuenta.getSaldoAnterior() != null ? cuenta.getSaldoAnterior() : BigDecimal.ZERO;
        BigDecimal debitos = cuenta.getDebitos() != null ? cuenta.getDebitos() : BigDecimal.ZERO;
        BigDecimal creditos = cuenta.getCreditos() != null ? cuenta.getCreditos() : BigDecimal.ZERO;

        BigDecimal saldoActual = saldoAnterior.subtract(debitos).add(creditos);

        return ResponseEntity.ok("Saldo actual: " + saldoActual);
    }
}
