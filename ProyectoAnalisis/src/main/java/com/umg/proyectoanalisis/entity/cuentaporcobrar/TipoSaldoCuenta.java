package com.umg.proyectoanalisis.entity.cuentaporcobrar;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "TIPO_SALDO_CUENTA")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoSaldoCuenta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdTipoSaldoCuenta")
    private Integer idTipoSaldoCuenta;
    
    @Column(name = "Nombre", length = 50)
    private String nombre;
    
    @Column(name = "FechaCreacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "UsuarioCreacion", nullable = false, length = 100)
    private String usuarioCreacion;
    
    @Column(name = "FechaModificacion")
    private LocalDateTime fechaModificacion;
    
    @Column(name = "UsuarioModificacion", length = 100)
    private String usuarioModificacion;
}

