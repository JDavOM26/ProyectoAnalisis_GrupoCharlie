package com.umg.proyectoAnalasis.entity.EntidadesSistemaDeMenus;
import java.time.LocalDateTime;
import com.umg.proyectoAnalasis.entity.EntidadesPrincipales.Role;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ROLE_OPCION")
@Data
@IdClass(RoleOpcionId.class)
public class RoleOpcion {

    @Id
    @Column(name = "Idrole")
    private Integer idRole;

    @Id
    @Column(name = "Idopcion")
    private Integer idOpcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Idrole", insertable = false, updatable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Idopcion", insertable = false, updatable = false)
    private Opcion opcion;

    @Column(name = "Alta", nullable = false)
    private Boolean alta;

    @Column(name = "Baja", nullable = false)
    private Boolean baja;

    @Column(name = "Cambio", nullable = false)
    private Boolean cambio;

    @Column(name = "Imprimir", nullable = false)
    private Boolean imprimir;

    @Column(name = "Exportar", nullable = false)
    private Boolean exportar;

    @Column(name = "Fechacreacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "Usuariocreacion", nullable = false, length = 100)
    private String usuarioCreacion;

    @Column(name = "Fechamodificacion")
    private LocalDateTime fechaModificacion;

    @Column(name = "Usuariomodificacion", length = 100)
    private String usuarioModificacion;
}
