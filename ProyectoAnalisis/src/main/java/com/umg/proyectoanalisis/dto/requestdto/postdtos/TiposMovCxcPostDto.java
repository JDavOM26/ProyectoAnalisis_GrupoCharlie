package com.umg.proyectoanalisis.dto.requestdto.postdtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TiposMovCxcPostDto {
	@NotBlank(message = "El ID de usuario no puede estar vacío")
	private String idUsuario;

	@NotNull(message = "El nombre no puede estar vacío")
	private Integer operacionCuentaCorriente;

	@NotBlank(message = "El nombre no puede estar vacío")
	private String nombre;
}
