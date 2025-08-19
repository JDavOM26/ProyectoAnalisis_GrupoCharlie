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

    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "Idstatususuario", nullable = false)
    private StatusUsuario statusUsuario;

    @Column(name = "Password", nullable = false, length = 100)
    private String password;

    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "Idgenero", nullable = false)
    private Genero genero;

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

    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "Idsucursal", nullable = false)
    private Sucursal sucursal;

    @Column(name = "Pregunta", nullable = false, length = 200)
    private String pregunta;

    @Column(name = "Respuesta", nullable = false, length = 200)
    private String respuesta;

    @ManyToOne(fetch = FetchType.LAZY)   
    @JoinColumn(name = "Idrole", nullable = false)
    private Role role;

    @Column(name = "Fechacreacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "Usuariocreacion", nullable = false, length = 100)
    private String usuarioCreacion;

    @Column(name = "Fechamodificacion")
    private LocalDateTime fechaModificacion;

    @Column(name = "Usuariomodificacion", length = 100)
    private String usuarioModificacion;
}
