package com.umg.proyectoanalisis.entity.cuentaporcobrar;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "PERSONA")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Persona {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdPersona")
    private Integer idPersona;
    
    @Column(name = "Nombre", nullable = false, length = 50)
    private String nombre;
    
    @Column(name = "Apellido", nullable = false, length = 50)
    private String apellido;
    
    @Column(name = "FechaNacimiento", nullable = false)
    private LocalDate fechaNacimiento;
    
  
    @Column(name = "IdGenero", nullable = false)
    private Integer idGenero;
    
    @Column(name = "Direccion", nullable = false, length = 100)
    private String direccion;
    
    @Column(name = "Telefono", nullable = false, length = 50)
    private String telefono;
    
    @Column(name = "CorreoElectronico", length = 50)
    private String correoElectronico;
    
    @Column(name = "IdEstadoCivil", nullable = false)
    private Integer idEstadoCivil;
    
    @Column(name = "FechaCreacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "UsuarioCreacion", nullable = false, length = 100)
    private String usuarioCreacion;
    
    @Column(name = "FechaModificacion")
    private LocalDateTime fechaModificacion;
    
    @Column(name = "UsuarioModificacion", length = 100)
    private String usuarioModificacion;
    
   
}
