package com.umg.proyectoAnalasis.repository.RepositoriosPrincipales;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoAnalasis.entity.EntidadesPrincipales.Genero;

@Repository("generoRepository")
public interface GeneroRepository extends JpaRepository<Genero, Integer> {
}
