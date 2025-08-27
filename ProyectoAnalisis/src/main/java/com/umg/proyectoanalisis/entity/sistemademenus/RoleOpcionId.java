package com.umg.proyectoanalisis.entity.sistemademenus;


import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class RoleOpcionId implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = -1509793388973011973L;
	private Integer idRole;
    private Integer idOpcion;
}
