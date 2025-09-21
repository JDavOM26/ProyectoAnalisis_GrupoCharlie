package com.umg.proyectoanalisis.repository.principales;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.principales.Role;

@Repository("roleRepository")
public interface RoleRepository extends JpaRepository<Role, Integer> {
}
