package com.umg.proyectoanalisis.dto;

import lombok.Data;

@Data
public class EmailDTO {
private String idUsuario;
private String para;
private String asunto;
private String cuerpo;
}