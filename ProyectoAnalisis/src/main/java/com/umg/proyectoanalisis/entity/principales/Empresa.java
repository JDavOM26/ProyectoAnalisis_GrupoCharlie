package com.umg.proyectoanalisis.entity.principales;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "EMPRESA")
@Data
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Idempresa")
    private Integer idEmpresa;

    @Column(name = "Nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "Direccion", nullable = false, length = 200)
    private String direccion;

    @Column(name = "Nit", nullable = false, length = 20)
    private String nit;

    @Column(name = "Passwordcantidadmayusculas")
    private Integer passwordCantidadMayusculas;

    @Column(name = "Passwordcantidadminusculas")
    private Integer passwordCantidadMinusculas;

    @Column(name = "Passwordcantidadcaracteresespeciales")
    private Integer passwordCantidadCaracteresEspeciales;

    @Column(name = "Passwordcantidadcaducidaddias")
    private Integer passwordCantidadCaducidadDias;

    @Column(name = "Passwordlargo")
    private Integer passwordLargo;

    @Column(name = "Passwordintentosantesdebloquear")
    private Integer passwordIntentosAntesDeBloquear;

    @Column(name = "Passwordcantidadnumeros")
    private Integer passwordCantidadNumeros;

    @Column(name = "Passwordcantidadpreguntasvalidar")
    private Integer passwordCantidadPreguntasValidar;

    @Column(name = "Fechacreacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "Usuariocreacion", nullable = false, length = 100)
    private String usuarioCreacion;

    @Column(name = "Fechamodificacion")
    private LocalDateTime fechaModificacion;

    @Column(name = "Usuariomodificacion", length = 100)
    private String usuarioModificacion;
}
