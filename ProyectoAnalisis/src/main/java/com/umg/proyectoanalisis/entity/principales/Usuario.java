package com.umg.proyectoanalisis.entity.principales;

import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "USUARIO")
@Data
public class Usuario {

    @Id
    @Column(name = "Idusuario", length = 100)
    private String idUsuario;

    @Column(name = "Nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "Apellido", nullable = false, length = 100)
    private String apellido;

    @Column(name = "Fechanacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "Idstatususuario", nullable = false)
    private Integer idStatusUsuario;

    @Column(name = "Password", nullable = false, length = 100)
    private String password;

    @Column(name = "Idgenero", nullable = false)
    private Integer idGenero;

    @Column(name = "Ultimafechaingreso")
    private LocalDateTime ultimaFechaIngreso;

    @Column(name = "Intentosdeacceso")
    private Integer intentosDeAcceso;

    @Column(name = "Sesionactual", length = 100)
    private String sesionActual;

    @Column(name = "Ultimafechacambiopassword")
    private LocalDateTime ultimaFechaCambioPassword;

    @Column(name = "Correoelectronico", length = 100)
    private String correoElectronico;

    @Column(name = "Requierecambiarpassword")
    private Integer requiereCambiarPassword;

    @Lob
    @Column(name = "Fotografia")
    private byte[] fotografia;

    @Column(name = "Telefonomovil", length = 30)
    private String telefonoMovil;

    @Column(name = "Idsucursal", nullable = false)
    private Integer idSucursal;

    @Column(name = "Pregunta", nullable = false, length = 200)
    private String pregunta;

    @Column(name = "Respuesta", nullable = false, length = 200)
    private String respuesta;

    @Column(name = "Idrole", nullable = false)
    private Integer idRole;

    @Column(name = "Fechacreacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "Usuariocreacion", nullable = false, length = 100)
    private String usuarioCreacion;

    @Column(name = "Fechamodificacion")
    private LocalDateTime fechaModificacion;

    @Column(name = "Usuariomodificacion", length = 100)
    private String usuarioModificacion;
}
