package com.umg.proyectoanalisis.entity.sistemademenus;
import java.time.LocalDateTime;



import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "MENU")
@Data
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Idmenu")
    private Integer idMenu;

 
    @Column(name = "Idmodulo", nullable = false)
    private Integer idModulo;

    @Column(name = "Nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "Ordenmenu", nullable = false)
    private Integer ordenMenu;

    @Column(name = "Fechacreacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "Usuariocreacion", nullable = false, length = 100)
    private String usuarioCreacion;

    @Column(name = "Fechamodificacion")
    private LocalDateTime fechaModificacion;

    @Column(name = "Usuariomodificacion", length = 100)
    private String usuarioModificacion;
}


