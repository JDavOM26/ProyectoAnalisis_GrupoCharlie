package com.umg.proyectoanalisis.entity.cuentaporcobrar;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "DOCUMENTO_PERSONA")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoPersona {
    
    @EmbeddedId
    private DocumentoPersonaId id;
    
  
    @Column(name = "IdTipoDocumento")
    private Integer idTipoDocumento;
    
    @Column(name = "IdPersona")
    private Integer idPersona;
    
    @Column(name = "NoDocumento", length = 50)
    private String noDocumento;
    
    @Column(name = "FechaCreacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "UsuarioCreacion", nullable = false, length = 100)
    private String usuarioCreacion;
    
    @Column(name = "FechaModificacion")
    private LocalDateTime fechaModificacion;
    
    @Column(name = "UsuarioModificacion", length = 100)
    private String usuarioModificacion;
}
