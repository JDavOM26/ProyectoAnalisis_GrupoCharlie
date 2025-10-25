package com.umg.proyectoanalisis.dto.requestdto.postdtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UsuarioPostDto {
    //USUARIO QUE CREA EL NUEVO USUARIO
    @NotBlank(message = "El ID de usuario no puede estar vacío")
    private String idUsuario;

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @NotBlank(message = "El apellido no puede estar vacío")
    private String apellido;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate fechaNacimiento;

    @NotNull(message = "El ID del estatus de usuario es obligatorio")
    private Integer idStatusUsuario;
     
    //SOLO PARA EL POST, NO ES OBLIGATORIO ENVIARLA EN EL PUT
    private String password;

    @NotNull(message = "El ID del género es obligatorio")
    private Integer idGenero;

    private String correoElectronico;

    private String telefonoMovil;

    @NotNull(message = "El ID de la sucursal es obligatorio")
    private Integer idSucursal;

    @NotBlank(message = "La pregunta de seguridad no puede estar vacía")
    private String pregunta;

    @NotBlank(message = "La respuesta de seguridad no puede estar vacía")
    private String respuesta;

    @NotNull(message = "El ID del rol es obligatorio")
    private Integer idRole;
}
