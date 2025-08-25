package com.umg.proyectoanalisis.dto.requestdto.postdto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class RoleOpcionPostDto {
   @NotNull(message = "El ID del rol no puede ser nulo")
    private Integer idRole;
     @NotNull(message = "El ID del usuario no puede ser nulo")
    private String idUsuario;

    @NotNull(message = "El ID de la opción no puede ser nulo")
    private Integer idOpcion;

    @NotNull(message = "El permiso de alta no puede ser nulo")
    private Boolean alta;

    @NotNull(message = "El permiso de baja no puede ser nulo")
    private Boolean baja;

    @NotNull(message = "El permiso de cambio no puede ser nulo")
    private Boolean cambio;

    @NotNull(message = "El permiso de imprimir no puede ser nulo")
    private Boolean imprimir;

    @NotNull(message = "El permiso de exportar no puede ser nulo")
    private Boolean exportar;
}
