package com.umg.proyectoanalisis.repository.auditoria;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.auditoria.TipoAcceso;

@Repository("tipoAccesoRepository")
public interface TipoAccesoRepository extends JpaRepository<TipoAcceso, Integer> {
}
