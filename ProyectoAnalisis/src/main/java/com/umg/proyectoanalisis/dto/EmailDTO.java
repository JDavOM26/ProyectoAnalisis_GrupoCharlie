package com.umg.proyectoanalisis.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailDTO {
@NotBlank(message = "El username no puede estar vacío")
private String idUsuario;
private String para;
private String asunto;
private String cuerpo;
}