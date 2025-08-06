package com.umg.proyectoAnalasis.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "OPCION")
@Data
public class Opcion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdOpcion", nullable = false)
    private Integer idOpcion;
    
    @Column(name = "IdMenu", nullable = false)
    private Integer idMenu;
    
    @Column(name = "Nombre", length = 50, nullable = false)
    private String nombre;
    
    @Column(name = "OrdenMenu", nullable = false)
    private Integer ordenMenu;
    
    @Column(name = "Pagina", length = 100, nullable = false)
    private String pagina;
    
    @Column(name = "FechaCreacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "UsuarioCreacion", length = 100, nullable = false)
    private String usuarioCreacion;
    
    @Column(name = "FechaModificacion")
    private LocalDateTime fechaModificacion;
    
    @Column(name = "UsuarioModificacion", length = 100)
    private String usuarioModificacion;
    
    // Relación
    @ManyToOne
    @JoinColumn(name = "IdMenu", insertable = false, updatable = false)
    private Menu menu;
}