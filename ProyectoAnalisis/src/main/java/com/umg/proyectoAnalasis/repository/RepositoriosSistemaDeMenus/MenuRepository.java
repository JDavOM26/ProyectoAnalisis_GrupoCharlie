package com.umg.proyectoAnalasis.repository.RepositoriosSistemaDeMenus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoAnalasis.entity.EntidadesSistemaDeMenus.Menu;

@Repository("menuRepository")
public interface MenuRepository extends JpaRepository<Menu, Integer> {
}
