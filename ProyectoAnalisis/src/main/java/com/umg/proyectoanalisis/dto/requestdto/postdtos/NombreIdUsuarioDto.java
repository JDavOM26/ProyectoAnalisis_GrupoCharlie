package com.umg.proyectoanalisis.dto.requestdto.postdtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NombreIdUsuarioDto {
@NotBlank(message = "El ID de usuario no puede estar vacío")
private String idUsuario;
 @NotBlank(message = "El nombre no puede estar vacío")
private String nombre;
}
