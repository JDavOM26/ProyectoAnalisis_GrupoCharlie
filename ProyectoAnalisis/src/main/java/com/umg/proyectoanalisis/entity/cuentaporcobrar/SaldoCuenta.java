package com.umg.proyectoanalisis.entity.cuentaporcobrar;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "SALDO_CUENTA")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaldoCuenta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdSaldoCuenta")
    private Integer idSaldoCuenta;
    

    @Column(name = "IdPersona", nullable = false)
    private Integer idPersona;
    

    @Column(name = "IdStatusCuenta", nullable = false)
    private Integer idStatusCuenta;
    
  
    @Column(name = "IdTipoSaldoCuenta", nullable = false)
    private Integer idTipoSaldoCuenta;
    
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
    
    @OneToMany(mappedBy = "idSaldoCuenta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MovimientoCuenta> movimientos;
}
