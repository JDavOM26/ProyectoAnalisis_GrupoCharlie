package com.umg.proyectoanalisis.repository.cuentaporcobrar.crud;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.umg.proyectoanalisis.entity.cuentaporcobrar.TipoDocumento;

@Repository("tiposDeDocumentosRepository")
public interface TiposDeDocumentosRepository extends JpaRepository<TipoDocumento, Integer> {
}