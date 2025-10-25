package com.umg.proyectoanalisis.entity.cuentaporcobrar;



import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoPersonaId implements Serializable {
    
    /**
	 * 
	 */
	private static final long serialVersionUID = -3320141633858162783L;


    private Integer idTipoDocumento;
    

    private Integer idPersona;
}


