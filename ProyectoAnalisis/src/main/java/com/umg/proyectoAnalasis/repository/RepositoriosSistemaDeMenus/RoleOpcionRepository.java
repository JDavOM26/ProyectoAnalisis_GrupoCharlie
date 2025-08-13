package com.umg.proyectoAnalasis.repository.RepositoriosSistemaDeMenus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoAnalasis.entity.EntidadesSistemaDeMenus.RoleOpcion;

@Repository("roleOpcionRepository")
public interface RoleOpcionRepository extends JpaRepository<RoleOpcion, Integer> {
}

