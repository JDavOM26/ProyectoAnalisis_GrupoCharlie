package com.umg.proyectoanalisis.entity.principales;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "SUCURSAL")
@Data
public class Sucursal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Idsucursal")
    private Integer idSucursal;

    @Column(name = "Nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "Direccion", nullable = false, length = 200)
    private String direccion;

    @Column(name = "Idempresa", nullable = false)
    private Integer idEmpresa;

    @Column(name = "Fechacreacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "Usuariocreacion", nullable = false, length = 100)
    private String usuarioCreacion;

    @Column(name = "Fechamodificacion")
    private LocalDateTime fechaModificacion;

    @Column(name = "Usuariomodificacion", length = 100)
    private String usuarioModificacion;
}
