package com.umg.proyectoanalisis.entity.sistemademenus;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "OPCION")
@Data
public class Opcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Idopcion")
    private Integer idOpcion;

    @Column(name = "Idmenu", nullable = false)
    private Integer idMenu;

    @Column(name = "Nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "Ordenmenu", nullable = false)
    private Integer ordenMenu;

    @Column(name = "Pagina", nullable = false, length = 100)
    private String pagina;

    @Column(name = "Fechacreacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "Usuariocreacion", nullable = false, length = 100)
    private String usuarioCreacion;

    @Column(name = "Fechamodificacion")
    private LocalDateTime fechaModificacion;

    @Column(name = "Usuariomodificacion", length = 100)
    private String usuarioModificacion;
}