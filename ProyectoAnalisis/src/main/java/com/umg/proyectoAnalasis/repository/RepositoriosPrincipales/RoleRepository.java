package com.umg.proyectoAnalasis.repository.RepositoriosPrincipales;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoAnalasis.entity.EntidadesPrincipales.Role;

@Repository("roleRepository")
public interface RoleRepository extends JpaRepository<Role, Integer> {
}
