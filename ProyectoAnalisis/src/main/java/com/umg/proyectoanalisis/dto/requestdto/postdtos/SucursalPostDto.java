package com.umg.proyectoanalisis.dto.requestdto.postdtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SucursalPostDto {

    @NotBlank(message = "El ID de usuario no puede estar vacío")
    private String idUsuario;

    @NotBlank(message = "El nombre de la sucursal no puede estar vacío")
    private String nombre;

    @NotBlank(message = "La dirección de la sucursal no puede estar vacía")
    private String direccion;

    @NotNull(message = "El ID de la empresa es obligatorio")
    private Integer idEmpresa;
}
