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
    @Column(name = "Idusuario", length = 100, nullable = false)
    private String idUsuario;

    @Column(name = "Nombre", length = 100, nullable = false)
    private String nombre;

    @Column(name = "Apellido", length = 100, nullable = false)
    private String apellido;

    @Column(name = "Fechanacimiento", nullable = true)
    private LocalDate fechaNacimiento;

    @Column(name = "Idstatususuario", nullable = false)
    private Integer idStatusUsuario;

    @Column(name = "Password", length = 100, nullable = false)
    private String password;

    @Column(name = "Idgenero", nullable = false)
    private Integer idGenero;

    @Column(name = "UltimafechaIngreso")
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

    @Column(name = "Fotografia", columnDefinition = "mediumblob")
    private byte[] fotografia;

    @Column(name = "Telefonomovil", length = 30)
    private String telefonoMovil;

    @Column(name = "IdSucursal", nullable = false)
    private Integer idSucursal;

    @Column(name = "Pregunta", length = 200, nullable = true)
    private String pregunta;

    @Column(name = "Respuesta", length = 200, nullable = true)
    private String respuesta;

    @Column(name = "Fechacreacion", nullable = true)
    private LocalDateTime fechaCreacion;

    @Column(name = "Usuariocreacion", length = 100, nullable = true)
    private String usuarioCreacion;

    @Column(name = "Fechamodificacion")
    private LocalDateTime fechaModificacion;
    
    @Column(name = "Fechabloqueo")
    private LocalDateTime fechabloqueo;

    @Column(name = "Usuariomodificacion", length = 100)
    private String usuarioModificacion;
    
   

    
}