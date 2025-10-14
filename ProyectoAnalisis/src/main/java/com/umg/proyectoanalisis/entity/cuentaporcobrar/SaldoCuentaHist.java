package com.umg.proyectoanalisis.entity.cuentaporcobrar;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "SALDO_CUENTA_HIST")
@Data
public class SaldoCuentaHist {
    
    @EmbeddedId
    private SaldoCuentaHistId id;
    
   
    @Column(name = "IdPersona", nullable = false)
    private Integer idPersona;
    
   
    @Column(name = "IdStatusCuenta", nullable = false)
    private Integer idStatusCuenta;
    
   
    @Column(name = "IdTipoSaldoCuenta", nullable = false)
    private Integer idTipoSaldoCuenta;
    

    @Column(name = "Mes", nullable=false)
    private Integer mes;
    
    @Column(name = "Anio",  nullable=false)
    private Integer anio;
    
    @Column(name = "SaldoAnterior", precision = 10, scale = 2)
    private BigDecimal saldoAnterior;
    
    @Column(name = "Debitos", precision = 10, scale = 2)
    private BigDecimal debitos;
    
    @Column(name = "Creditos", precision = 10, scale = 2)
    private BigDecimal creditos;
    
    @Column(name = "FechaCreacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "UsuarioCreacion", nullable = false, length = 100)
    private String usuarioCreacion;
    
    @Column(name = "FechaModificacion")
    private LocalDateTime fechaModificacion;
    
    @Column(name = "UsuarioModificacion", length = 100)
    private String usuarioModificacion;
    
}