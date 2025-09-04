package com.umg.proyectoanalisis.controller.principales;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.umg.proyectoanalisis.dto.requestdto.postdtos.EmpresaPostDto;
import com.umg.proyectoanalisis.entity.principales.Empresa;
import com.umg.proyectoanalisis.repository.principales.EmpresaRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth/empresa")
public class EmpresaController {

    @Autowired
    EmpresaRepository empresaRepository;

    // Obtener todas las empresas
    @GetMapping("/GetEmpresas")
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
    @PostMapping("/CrearEmpresa")
    public ResponseEntity<Empresa> crearEmpresa(@Valid @RequestBody EmpresaPostDto empresaDto) {
        try {
            Empresa empresa = new Empresa();
            empresa.setNombre(empresaDto.getNombre());
            empresa.setDireccion(empresaDto.getDireccion());
            empresa.setNit(empresaDto.getNit());
            empresa.setPasswordCantidadMayusculas(empresaDto.getPasswordCantidadMayusculas());
            empresa.setPasswordCantidadMinusculas(empresaDto.getPasswordCantidadMinusculas());
            empresa.setPasswordCantidadCaracteresEspeciales(empresaDto.getPasswordCantidadCaracteresEspeciales());
            empresa.setPasswordCantidadCaducidadDias(empresaDto.getPasswordCantidadCaducidadDias());
            empresa.setPasswordLargo(empresaDto.getPasswordLargo());
            empresa.setPasswordIntentosAntesDeBloquear(empresaDto.getPasswordIntentosAntesDeBloquear());
            empresa.setPasswordCantidadNumeros(empresaDto.getPasswordCantidadNumeros());
            empresa.setPasswordCantidadPreguntasValidar(empresaDto.getPasswordCantidadPreguntasValidar());

            empresa.setFechaCreacion(LocalDateTime.now());
            empresa.setUsuarioCreacion(empresaDto.getIdUsuario());

            Empresa empresaGuardada = empresaRepository.save(empresa);
            return new ResponseEntity<>(empresaGuardada, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Actualizar empresa
    @PutMapping("/ActualizarEmpresa/{idEmpresa}")
    public ResponseEntity<Empresa> actualizarEmpresa(@PathVariable Integer idEmpresa, @Valid @RequestBody EmpresaPostDto empresaDto) {
        try {
            Empresa empresaExistente = empresaRepository.findById(idEmpresa)
                    .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

           

            empresaExistente.setNombre(empresaDto.getNombre());
            empresaExistente.setDireccion(empresaDto.getDireccion());
            empresaExistente.setNit(empresaDto.getNit());
            empresaExistente.setPasswordCantidadMayusculas(empresaDto.getPasswordCantidadMayusculas());
            empresaExistente.setPasswordCantidadMinusculas(empresaDto.getPasswordCantidadMinusculas());
            empresaExistente.setPasswordCantidadCaracteresEspeciales(empresaDto.getPasswordCantidadCaracteresEspeciales());
            empresaExistente.setPasswordCantidadCaducidadDias(empresaDto.getPasswordCantidadCaducidadDias());
            empresaExistente.setPasswordLargo(empresaDto.getPasswordLargo());
            empresaExistente.setPasswordIntentosAntesDeBloquear(empresaDto.getPasswordIntentosAntesDeBloquear());
            empresaExistente.setPasswordCantidadNumeros(empresaDto.getPasswordCantidadNumeros());
            empresaExistente.setPasswordCantidadPreguntasValidar(empresaDto.getPasswordCantidadPreguntasValidar());
            empresaExistente.setFechaModificacion(LocalDateTime.now());
            empresaExistente.setUsuarioModificacion(empresaDto.getIdUsuario());

            Empresa empresaActualizada = empresaRepository.save(empresaExistente);
            return new ResponseEntity<>(empresaActualizada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Eliminar empresa
    @DeleteMapping("/BorrarEmpresa")
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
