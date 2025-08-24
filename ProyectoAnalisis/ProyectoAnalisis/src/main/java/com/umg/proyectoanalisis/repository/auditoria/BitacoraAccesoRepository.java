package com.umg.proyectoanalisis.repository.auditoria;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.auditoria.BitacoraAcceso;

@Repository("bitacoraAccesoRepository")
public interface BitacoraAccesoRepository  extends JpaRepository<BitacoraAcceso, Integer> {
}
