package com.umg.proyectoanalisis.repository.sistemademenus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.sistemademenus.Opcion;

@Repository("opcionRepository")
public interface OpcionRepository  extends JpaRepository<Opcion, Integer> {
}

