package com.umg.proyectoanalisis.repository.sistemademenus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.sistemademenus.RoleOpcion;
import com.umg.proyectoanalisis.entity.sistemademenus.RoleOpcionId;

@Repository("roleOpcionRepository")
public interface RoleOpcionRepository extends JpaRepository<RoleOpcion, RoleOpcionId> {
}

