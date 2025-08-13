package com.umg.proyectoAnalasis.repository.RepositoriosSistemaDeMenus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoAnalasis.entity.EntidadesSistemaDeMenus.Modulo;

@Repository("moduloRepository")
public interface ModuloRepository extends JpaRepository<Modulo, Integer> {
}
