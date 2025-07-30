package com.umg.proyectoAnalasis.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;


@Entity
@Table(name = "USUARIO")
@Data
public class Usuario {
    /*
     *PENDIENTE REVISAR LOS NULLABLE Y LOS TIPOS DE DATO.
	  PENDIENTE VALIDAR SI VAMOS A DEJAR username como IdUsuario, tener en cuenta que un username es mutable por que 
	un usuario puede cambiar su username y eso hace que no sea confiable identificar la entidad con el username
	*/
    @Id
    @Column(name = "IdUsuario", length = 100)
    private String idUsuario;

    @Column(name = "Nombre", length = 100, nullable = false)
    private String nombre;

    @Column(name = "Apellido", length = 100, nullable = false)
    private String apellido;

    @Column(name = "FechaNacimiento", nullable = true)
    private LocalDate fechaNacimiento;

    @Column(name = "IdStatusUsuario", nullable = false)
    private Integer idStatusUsuario;

    @Column(name = "Password", length = 100, nullable = false)
    private String password;

    @Column(name = "IdGenero", nullable = false)
    private Integer idGenero;

    @Column(name = "UltimaFechaIngreso")
    private LocalDateTime ultimaFechaIngreso;

    @Column(name = "IntentosDeAcceso")
    private Integer intentosDeAcceso;

    @Column(name = "SesionActual", length = 100)
    private String sesionActual;

    @Column(name = "UltimaFechaCambioPassword")
    private LocalDateTime ultimaFechaCambioPassword;

    @Column(name = "CorreoElectronico", length = 100)
    private String correoElectronico;

    @Column(name = "RequiereCambiarPassword")
    private Integer requiereCambiarPassword;

    @Column(name = "Fotografia", columnDefinition = "mediumblob")
    private byte[] fotografia;

    @Column(name = "TelefonoMovil", length = 30)
    private String telefonoMovil;

    @Column(name = "IdSucursal", nullable = false)
    private Integer idSucursal;

    @Column(name = "Pregunta", length = 200, nullable = true)
    private String pregunta;

    @Column(name = "Respuesta", length = 200, nullable = true)
    private String respuesta;

    @Column(name = "FechaCreacion", nullable = true)
    private LocalDateTime fechaCreacion;

    @Column(name = "UsuarioCreacion", length = 100, nullable = true)
    private String usuarioCreacion;

    @Column(name = "FechaModificacion")
    private LocalDateTime fechaModificacion;

    @Column(name = "UsuarioModificacion", length = 100)
    private String usuarioModificacion;

    
}