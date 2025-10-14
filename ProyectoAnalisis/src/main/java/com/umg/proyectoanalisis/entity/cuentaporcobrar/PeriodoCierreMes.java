package com.umg.proyectoanalisis.entity.cuentaporcobrar;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "PERIODO_CIERRE_MES")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeriodoCierreMes {
    
    @EmbeddedId
    private PeriodoCierreMesId id;
    
    @Column(name = "FechaInicio", nullable = false)
    private LocalDate fechaInicio;
    
    @Column(name = "FechaFinal", nullable = false)
    private LocalDate fechaFinal;
    
    @Column(name = "FechaCierre")
    private LocalDateTime fechaCierre;
}