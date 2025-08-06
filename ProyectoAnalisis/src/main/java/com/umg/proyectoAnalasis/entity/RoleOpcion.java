package com.umg.proyectoAnalasis.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ROLE_OPCION")
@Data
@IdClass(RoleOpcionId.class)
public class RoleOpcion {
    
    @Id
    @Column(name = "IdRole", nullable = false)
    private Integer idRole;
    
    @Id
    @Column(name = "IdOpcion", nullable = false)
    private Integer idOpcion;
    
    @Column(name = "Alta", nullable = false)
    private Integer alta;
    
    @Column(name = "Baja", nullable = false)
    private Integer baja;
    
    @Column(name = "Cambio", nullable = false)
    private Integer cambio;
    
    @Column(name = "Imprimir", nullable = false)
    private Integer imprimir;
    
    @Column(name = "Exportar", nullable = false)
    private Integer exportar;
    
    @Column(name = "FechaCreacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "UsuarioCreacion", length = 100, nullable = false)
    private String usuarioCreacion;
    
    @Column(name = "FechaModificacion")
    private LocalDateTime fechaModificacion;
    
    @Column(name = "UsuarioModificacion", length = 100)
    private String usuarioModificacion;
    
    // Relaciones
    @ManyToOne
    @JoinColumn(name = "IdRole", insertable = false, updatable = false)
    private Role role;
    
    @ManyToOne
    @JoinColumn(name = "IdOpcion", insertable = false, updatable = false)
    private Opcion opcion;
}
