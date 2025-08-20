package com.umg.proyectoAnalasis.repository.RepositoriosSistemaDeMenus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoAnalasis.entity.EntidadesSistemaDeMenus.RoleOpcion;
import com.umg.proyectoAnalasis.entity.EntidadesSistemaDeMenus.RoleOpcionId;

@Repository("roleOpcionRepository")
public interface RoleOpcionRepository extends JpaRepository<RoleOpcion, RoleOpcionId> {
}

