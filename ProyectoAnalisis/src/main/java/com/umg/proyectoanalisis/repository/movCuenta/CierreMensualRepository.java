package com.umg.proyectoanalisis.repository.movCuenta;

import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import com.umg.proyectoanalisis.entity.cuentaporcobrar.SaldoCuenta;

public interface CierreMensualRepository extends CrudRepository<SaldoCuenta, Long> {
    @Procedure(procedureName = "sp_cierre_mensual")
    Integer ejecutarCierreMensual(@Param("p_usuario") String usuario);
} 