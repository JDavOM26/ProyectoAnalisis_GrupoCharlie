package com.umg.proyectoanalisis.entity.cuentaporcobrar;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "TIPO_MOVIMIENTO_CXC")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoMovimientoCxc {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdTipoMovimientoCXC")
    private Integer idTipoMovimientoCXC;
    
    @Column(name = "Nombre", nullable = false, length = 75)
    private String nombre;
    
    @Column(name = "OperacionCuentaCorriente", nullable = false)
    private Integer operacionCuentaCorriente;
    
    @Column(name = "FechaCreacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "UsuarioCreacion", nullable = false, length = 100)
    private String usuarioCreacion;
    
    @Column(name = "FechaModificacion")
    private LocalDateTime fechaModificacion;
    
    @Column(name = "UsuarioModificacion", length = 100)
    private String usuarioModificacion;
}
