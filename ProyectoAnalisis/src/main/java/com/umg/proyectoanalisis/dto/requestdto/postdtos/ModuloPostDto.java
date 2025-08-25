package com.umg.proyectoanalisis.dto.requestdto.postdtos;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ModuloPostDto {
    @NotBlank(message = "El ID de usuario no puede estar vacío")
    private String idUsuario;

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @NotNull(message = "El orden del menú no puede ser nulo")
    @Positive(message = "El orden del menú debe ser positivo")
    private Integer ordenMenu;
}
