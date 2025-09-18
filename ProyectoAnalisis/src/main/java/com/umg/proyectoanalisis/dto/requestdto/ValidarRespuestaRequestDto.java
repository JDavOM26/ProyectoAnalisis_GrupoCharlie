package com.umg.proyectoanalisis.dto.requestdto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ValidarRespuestaRequestDto {
@NotBlank(message = "El username no puede estar vacío")    
private String idUsuario;
@NotBlank(message = "La respuesta no puede estar vacía")
private String respuesta;

}
