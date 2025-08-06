package com.umg.proyectoAnalasis.entity;

import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class RoleOpcionId implements Serializable {
    private Integer idRole;
    private Integer idOpcion;
}