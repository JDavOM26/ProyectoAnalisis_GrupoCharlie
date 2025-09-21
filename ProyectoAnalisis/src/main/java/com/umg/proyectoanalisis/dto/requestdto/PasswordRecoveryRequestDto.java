package com.umg.proyectoanalisis.dto.requestdto;

import lombok.Data;

@Data
public class PasswordRecoveryRequestDto {
private String idUsuario;
private String email;
}
