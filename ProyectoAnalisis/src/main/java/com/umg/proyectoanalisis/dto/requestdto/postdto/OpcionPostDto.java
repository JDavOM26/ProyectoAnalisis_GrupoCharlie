package com.umg.proyectoanalisis.dto.requestdto.postdto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class OpcionPostDto {
 @NotBlank(message = "El ID de usuario no puede estar vacío")
    private String idUsuario;

    @NotNull(message = "El ID de menú no puede ser nulo")
    private Integer idMenu;

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @NotNull(message = "El orden del menú no puede ser nulo")
    @Positive(message = "El orden del menú debe ser positivo")
    private Integer ordenMenu;

    @NotBlank(message = "La página no puede estar vacía")
    private String pagina;
}