package com.umg.proyectoanalisis.entity.cuentaporcobrar;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public class SaldoCuentaHistId implements Serializable {
    
    /**
	 * 
	 */
	
	private static final long serialVersionUID = -42479603657817999L;

	
    private Integer anio;
    
  
    private Integer mes;
    
  
    private Integer idSaldoCuenta;
    
}