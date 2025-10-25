package com.umg.proyectoanalisis.repository.cuentaporcobrar.altaymantenimiento;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.cuentaporcobrar.SaldoCuenta;

@Repository
public interface SaldoCuentaRepository extends JpaRepository<SaldoCuenta, Integer> {
    List<SaldoCuenta> findByIdPersona(Integer idPersona);
}
