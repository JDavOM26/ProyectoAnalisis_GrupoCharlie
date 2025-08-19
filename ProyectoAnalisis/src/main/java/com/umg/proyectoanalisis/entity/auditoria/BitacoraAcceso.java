package com.umg.proyectoanalisis.entity.auditoria;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "BITACORA_ACCESO")
@Data
public class BitacoraAcceso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Idbitacoraacceso")
    private Integer idBitacoraAcceso;

    @Column(name = "Idusuario", nullable = false, length = 100)
    private String idUsuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Idtipoacceso", nullable = false)
    private TipoAcceso tipoAcceso;

    @Column(name = "Fechaacceso", nullable = false)
    private LocalDateTime fechaAcceso;

    @Column(name = "Httpuseragent", length = 200)
    private String httpUserAgent;

    @Column(name = "Direccionip", length = 50)
    private String direccionIp;

    @Column(name = "Accion", length = 100)
    private String accion;

    @Column(name = "Sistemaoperativo", length = 50)
    private String sistemaOperativo;

    @Column(name = "Dispositivo", length = 50)
    private String dispositivo;

    @Column(name = "Browser", length = 50)
    private String browser;

    @Column(name = "Sesion", length = 100)
    private String sesion;
}
