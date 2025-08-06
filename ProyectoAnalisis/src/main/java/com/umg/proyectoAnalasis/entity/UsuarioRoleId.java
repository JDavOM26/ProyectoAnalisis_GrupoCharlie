package com.umg.proyectoAnalasis.entity;

import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class UsuarioRoleId implements Serializable {
    private String idUsuario;
    private Integer idRole;
}