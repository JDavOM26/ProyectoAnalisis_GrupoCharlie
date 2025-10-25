package com.umg.proyectoanalisis.entity.cuentaporcobrar;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "MOVIMIENTO_CUENTA")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoCuenta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdMovimientoCuenta")
    private Integer idMovimientoCuenta;
    

    @Column(name = "IdSaldoCuenta", nullable = false)
    private Integer idSaldoCuenta;
    
   
    @Column(name = "IdTipoMovimientoCXC", nullable = false)
    private Integer idTipoMovimientoCXC;
    
    @Column(name = "FechaMovimiento", nullable = false)
    private LocalDateTime fechaMovimiento;
    
    @Column(name = "ValorMovimiento", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorMovimiento;
    
    @Column(name = "ValorMovimientoPagado", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorMovimientoPagado;
    
    @Column(name = "GeneradoAutomaticamente", nullable = false)
    private Boolean generadoAutomaticamente;
    
    @Column(name = "Descripcion", nullable = false, length = 75)
    private String descripcion;
    
    @Column(name = "FechaCreacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "UsuarioCreacion", nullable = false, length = 100)
    private String usuarioCreacion;
    
    @Column(name = "FechaModificacion")
    private LocalDateTime fechaModificacion;
    
    @Column(name = "UsuarioModificacion", length = 100)
    private String usuarioModificacion;
}