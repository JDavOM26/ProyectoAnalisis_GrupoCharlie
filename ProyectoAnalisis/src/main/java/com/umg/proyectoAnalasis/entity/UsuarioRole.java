package com.umg.proyectoAnalasis.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "USUARIO_ROLE")
@Data
@IdClass(UsuarioRoleId.class)
public class UsuarioRole {
    
    @Id
    @Column(name = "IdUsuario", length = 100, nullable = false)
    private String idUsuario;
    
    @Id
    @Column(name = "IdRole", nullable = false)
    private Integer idRole;
    
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
}