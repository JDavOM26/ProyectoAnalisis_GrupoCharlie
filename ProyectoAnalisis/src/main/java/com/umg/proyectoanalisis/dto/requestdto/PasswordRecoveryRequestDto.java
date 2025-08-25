package com.umg.proyectoanalisis.dto.requestdto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasswordRecoveryRequestDto {
@NotBlank(message = "El username no puede estar vacío")
private String idUsuario;
}
