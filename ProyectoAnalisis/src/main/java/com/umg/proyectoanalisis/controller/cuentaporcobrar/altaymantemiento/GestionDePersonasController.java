package com.umg.proyectoanalisis.controller.cuentaporcobrar.altaymantemiento;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.umg.proyectoanalisis.entity.cuentaporcobrar.Persona;
import com.umg.proyectoanalisis.repository.cuentaporcobrar.altaymantenimiento.PersonaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class GestionDePersonasController {

    @Autowired
    private PersonaRepository personaRepository;

    // --- LISTAR (Paginado) ---
    // Este se consume asi GET:
    // http://localhost:8080/api/auth/personas-paginado?page=0&size=5
    // Sirve para paginar resultados y que de segun el tamano, de default esta en 5,
    // para que se ajuste
    // A como lo quieren en el front.
    @GetMapping("/obtener/personas-paginado/")
    public Page<Persona> getAllPersonasPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return personaRepository.findAll(PageRequest.of(page, size));
    }

    // --- ALTA (CREAR NUEVA PERSONA) ---
    @PostMapping("/personas/crear")
    public ResponseEntity<?> crearPersona(@RequestBody Persona persona) {
        if (persona.getUsuarioCreacion() == null || persona.getUsuarioCreacion().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El campo 'usuarioModificacion' no puede estar vacio.");
        }

        persona.setIdPersona(null);
        persona.setFechaCreacion(LocalDateTime.now());
        Persona nuevaPersona = personaRepository.save(persona);
        return ResponseEntity.ok(nuevaPersona);
    }

    // --- MANTENIMIENTO (ACTUALIZAR PERSONA EXISTENTE) ---
    @PutMapping("/personas/actualizar/{id}")
    public ResponseEntity<?> actualizarPersona(@PathVariable Integer id, @RequestBody Persona personaActualizada) {
        if (personaActualizada.getUsuarioModificacion() == null
                || personaActualizada.getUsuarioModificacion().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El campo 'usuarioModificacion' no puede estar vacio.");
        }

        Optional<Persona> optionalPersona = personaRepository.findById(id);
        if (optionalPersona.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Persona personaExistente = optionalPersona.get();

        personaExistente.setNombre(personaActualizada.getNombre());
        personaExistente.setApellido(personaActualizada.getApellido());
        personaExistente.setFechaNacimiento(personaActualizada.getFechaNacimiento());
        personaExistente.setIdGenero(personaActualizada.getIdGenero());
        personaExistente.setDireccion(personaActualizada.getDireccion());
        personaExistente.setTelefono(personaActualizada.getTelefono());
        personaExistente.setCorreoElectronico(personaActualizada.getCorreoElectronico());
        personaExistente.setIdEstadoCivil(personaActualizada.getIdEstadoCivil());

        personaExistente.setFechaModificacion(LocalDateTime.now());
        personaExistente.setUsuarioModificacion(personaActualizada.getUsuarioModificacion());

        Persona personaGuardada = personaRepository.save(personaExistente);
        return ResponseEntity.ok(personaGuardada);
    }

    // --- ELIMINAR PERSONA POR ID ---
    @DeleteMapping("/personas/eliminar/{id}")
    public ResponseEntity<?> eliminarPersona(@PathVariable Integer id) {
        Optional<Persona> persona = personaRepository.findById(id);

        if (persona.isEmpty()) {
            return ResponseEntity.status(404).body("No se encontró la persona con ID: " + id);
        }

        try {
            personaRepository.deleteById(id);
            return ResponseEntity.ok("Persona eliminada correctamente.");
        } catch (org.springframework.dao.DataIntegrityViolationException e) {

            return ResponseEntity.status(409).body(
                    "No se puede eliminar la persona con ID " + id +
                            ", Aun se encuentrar registros de esta persona.");
        } catch (Exception e) {

            return ResponseEntity.status(500).body(
                    "Ocurrió un error inesperado al eliminar la persona: " + e.getMessage());
        }
    }

    // --- BUSCAR PERSONA POR CORREO ELECTRÓNICO --- Ejemplo de uso : GET
    // http://localhost:8080/api/auth/personas/buscar-por-correo?correo=carlos.perez@mail.com
    @GetMapping("/personas/buscar-por-correo")
    public ResponseEntity<Persona> buscarPorCorreo(@RequestParam String correo) {
        return personaRepository.findByCorreoElectronico(correo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
