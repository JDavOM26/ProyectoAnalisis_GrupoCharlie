package com.umg.proyectoAnalasis.repository.RepositoriosSistemaDeMenus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoAnalasis.entity.EntidadesSistemaDeMenus.Opcion;

@Repository("opcionRepository")
public interface OpcionRepository  extends JpaRepository<Opcion, Integer> {
}

