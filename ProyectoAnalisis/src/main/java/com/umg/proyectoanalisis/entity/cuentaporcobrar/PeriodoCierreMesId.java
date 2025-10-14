package com.umg.proyectoanalisis.entity.cuentaporcobrar;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeriodoCierreMesId implements Serializable {
    
    /**
	 * 
	 */
	private static final long serialVersionUID = 2064303288277962943L;

	@Column(name = "Anio")
    private Integer anio;
    
    @Column(name = "Mes")
    private Integer mes;
}
