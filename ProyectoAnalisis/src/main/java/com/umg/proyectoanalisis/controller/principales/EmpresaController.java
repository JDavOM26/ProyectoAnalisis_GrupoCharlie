package com.umg.proyectoanalisis.controller.principales;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.umg.proyectoanalisis.entity.principales.Empresa;
import com.umg.proyectoanalisis.repository.principales.EmpresaRepository;

@RestController
@RequestMapping("/api/noauth/empresa")
public class EmpresaController {

    @Autowired
    EmpresaRepository empresaRepository;

    // Obtener todas las empresas
    @GetMapping("/Getempresas")
    public ResponseEntity<List<Empresa>> getAllEmpresas() {
        try {
            List<Empresa> empresas = empresaRepository.findAll();
            if (empresas.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(empresas, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Crear empresa
    @PostMapping("/crear-empresa")
    public ResponseEntity<Empresa> crearEmpresa(@RequestBody Empresa empresa) {
        try {
            if (empresa.getNombre() == null || empresa.getNombre().isEmpty()
                    || empresa.getDireccion() == null || empresa.getDireccion().isEmpty()
                    || empresa.getNit() == null || empresa.getNit().isEmpty()) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            empresa.setFechaCreacion(LocalDateTime.now());
            empresa.setUsuarioCreacion("Administrador");

            Empresa empresaGuardada = empresaRepository.save(empresa);
            return new ResponseEntity<>(empresaGuardada, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Actualizar empresa
    @PutMapping("/actualizarEmpresa")
    public ResponseEntity<Empresa> actualizarEmpresa(@RequestBody Empresa empresa) {
        try {
            Empresa empresaExistente = empresaRepository.findById(empresa.getIdEmpresa())
                    .orElseThrow(() -> new RuntimeException("Empresa no encontrada con id: " + empresa.getIdEmpresa()));

            if (empresa.getNombre() == null || empresa.getNombre().isEmpty()
                    || empresa.getDireccion() == null || empresa.getDireccion().isEmpty()
                    || empresa.getNit() == null || empresa.getNit().isEmpty()) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            empresaExistente.setNombre(empresa.getNombre());
            empresaExistente.setDireccion(empresa.getDireccion());
            empresaExistente.setNit(empresa.getNit());
            empresaExistente.setPasswordCantidadMayusculas(empresa.getPasswordCantidadMayusculas());
            empresaExistente.setPasswordCantidadMinusculas(empresa.getPasswordCantidadMinusculas());
            empresaExistente.setPasswordCantidadCaracteresEspeciales(empresa.getPasswordCantidadCaracteresEspeciales());
            empresaExistente.setPasswordCantidadCaducidadDias(empresa.getPasswordCantidadCaducidadDias());
            empresaExistente.setPasswordLargo(empresa.getPasswordLargo());
            empresaExistente.setPasswordIntentosAntesDeBloquear(empresa.getPasswordIntentosAntesDeBloquear());
            empresaExistente.setPasswordCantidadNumeros(empresa.getPasswordCantidadNumeros());
            empresaExistente.setPasswordCantidadPreguntasValidar(empresa.getPasswordCantidadPreguntasValidar());
            empresaExistente.setFechaModificacion(LocalDateTime.now());
            empresaExistente.setUsuarioModificacion("Administrador");

            Empresa empresaActualizada = empresaRepository.save(empresaExistente);
            return new ResponseEntity<>(empresaActualizada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Eliminar empresa
    @DeleteMapping("/borrarEmpresa")
    public ResponseEntity<String> borrarEmpresa(@RequestParam Integer idEmpresa) {
        try {
            if (!empresaRepository.existsById(idEmpresa)) {
                return new ResponseEntity<>("Empresa no encontrada con id: " + idEmpresa, HttpStatus.NOT_FOUND);
            }
            empresaRepository.deleteById(idEmpresa);
            return new ResponseEntity<>("Empresa eliminada exitosamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar la empresa", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
