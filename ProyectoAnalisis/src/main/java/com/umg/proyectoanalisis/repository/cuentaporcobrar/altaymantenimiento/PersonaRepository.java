package com.umg.proyectoanalisis.repository.cuentaporcobrar.altaymantenimiento;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.cuentaporcobrar.Persona;

@Repository("personaRepository")
public interface PersonaRepository extends JpaRepository<Persona, Integer> {
	Page<Persona> findAll(Pageable pageable);

	Optional<Persona> findByCorreoElectronico(String correoElectronico);
}
