package com.umg.proyectoAnalasis.repository.RepositoriosAuditoria;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.umg.proyectoAnalasis.entity.EntidadesAuditoria.BitacoraAcceso;

@Repository("bitacoraAccesoRepository")
public interface BitacoraAccesoRepository  extends JpaRepository<BitacoraAcceso, Integer> {
}
