package com.umg.proyectoanalisis.repository.principales;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.principales.Sucursal;

@Repository("sucursalRepository")
public interface SucursalRepository extends JpaRepository<Sucursal, Integer> {
}
