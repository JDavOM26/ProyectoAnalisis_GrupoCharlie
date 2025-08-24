package com.umg.proyectoanalisis.repository.principales;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.principales.StatusUsuario;

@Repository("statusUsuarioRepository")
public interface StatusUsuarioRepository extends JpaRepository<StatusUsuario, Integer> {
}
