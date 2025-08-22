package com.umg.proyectoAnalasis.repository.RepositoriosAuditoria;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoAnalasis.entity.EntidadesAuditoria.TipoAcceso;

@Repository("tipoAccesoRepository")
public interface TipoAccesoRepository extends JpaRepository<TipoAcceso, Integer> {
    TipoAcceso findByNombre(String nombre);
}
