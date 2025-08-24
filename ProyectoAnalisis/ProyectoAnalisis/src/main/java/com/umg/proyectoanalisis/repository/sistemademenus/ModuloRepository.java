package com.umg.proyectoanalisis.repository.sistemademenus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.sistemademenus.Modulo;

@Repository("moduloRepository")
public interface ModuloRepository extends JpaRepository<Modulo, Integer> {
}
