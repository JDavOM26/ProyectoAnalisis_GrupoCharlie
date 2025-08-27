package com.umg.proyectoanalisis.dto.responsedto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasswordRecoveryResponseDto {
@NotBlank(message = "La pregunta no puede estar vacía")
private String pregunta;
}
