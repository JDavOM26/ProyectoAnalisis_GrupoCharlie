package com.umg.proyectoanalisis.dto;

import lombok.Data;

@Data
public class NuevaContraseniaDto {
	private String idUsuario;
	private String oldPassword;
	private String newPassword;
}
