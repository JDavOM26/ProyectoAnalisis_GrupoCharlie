package com.umg.proyectoanalisis.entity.auditoria;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name = "TIPO_ACCESO")
@Data
public class TipoAcceso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Idtipoacceso")
    private Integer idTipoAcceso;

    @Column(name = "Nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "Fechacreacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "Usuariocreacion", nullable = false, length = 100)
    private String usuarioCreacion;

    @Column(name = "Fechamodificacion")
    private LocalDateTime fechaModificacion;

    @Column(name = "Usuariomodificacion", length = 100)
    private String usuarioModificacion;
}
