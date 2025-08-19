package com.umg.proyectoanalisis.repository.principales;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.principales.Genero;

@Repository("generoRepository")
public interface GeneroRepository extends JpaRepository<Genero, Integer> {
}
