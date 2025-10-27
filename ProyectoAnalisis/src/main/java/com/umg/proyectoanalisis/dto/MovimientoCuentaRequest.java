package com.umg.proyectoanalisis.dto;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class MovimientoCuentaRequest {
    private Integer idSaldoCuenta;
    private Integer idTipoMovimientoCXC;
    private LocalDateTime fechaMovimiento;
    private Double valorMovimiento;
    private String descripcion;
    private String usuarioCreacion;
}