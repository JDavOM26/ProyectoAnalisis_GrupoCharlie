package com.umg.proyectoanalisis.dto.requestdto.postdtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmpresaPostDto {

    @NotBlank(message = "El ID de usuario no puede estar vacío")
    private String idUsuario;

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @NotBlank(message = "La dirección no puede estar vacía")
    private String direccion;

    @NotBlank(message = "El NIT no puede estar vacío")
    private String nit;

    @NotNull(message = "La cantidad de mayúsculas es obligatoria")
    private Integer passwordCantidadMayusculas;

    @NotNull(message = "La cantidad de minúsculas es obligatoria")
    private Integer passwordCantidadMinusculas;

    @NotNull(message = "La cantidad de caracteres especiales es obligatoria")
    private Integer passwordCantidadCaracteresEspeciales;

    @NotNull(message = "La caducidad de la contraseña es obligatoria")
    private Integer passwordCantidadCaducidadDias;

    @NotNull(message = "El largo de la contraseña es obligatorio")
    private Integer passwordLargo;

    @NotNull(message = "Los intentos antes de bloquear son obligatorios")
    private Integer passwordIntentosAntesDeBloquear;

    @NotNull(message = "La cantidad de números es obligatoria")
    private Integer passwordCantidadNumeros;

    @NotNull(message = "La cantidad de preguntas para validar es obligatoria")
    private Integer passwordCantidadPreguntasValidar;

}