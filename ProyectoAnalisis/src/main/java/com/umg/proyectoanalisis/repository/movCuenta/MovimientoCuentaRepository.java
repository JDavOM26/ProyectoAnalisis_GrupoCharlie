package com.umg.proyectoanalisis.repository.movCuenta;

import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.umg.proyectoanalisis.entity.cuentaporcobrar.MovimientoCuenta;

public interface MovimientoCuentaRepository extends CrudRepository<MovimientoCuenta, Integer>{
    @Procedure(procedureName = "sp_registrar_movimiento_cuenta")
    void registrarMovimiento(
        @Param("p_idSaldoCuenta") Integer idSaldoCuenta,
        @Param("p_idTipoMovimientoCXC") Integer idTipoMovimientoCXC,
        @Param("p_fechaMovimiento") java.sql.Timestamp fechaMovimiento,
        @Param("p_valorMovimiento") Double valorMovimiento,
        @Param("p_descripcion") String descripcion,
        @Param("p_usuarioCreacion") String usuarioCreacion
    );
    
} 