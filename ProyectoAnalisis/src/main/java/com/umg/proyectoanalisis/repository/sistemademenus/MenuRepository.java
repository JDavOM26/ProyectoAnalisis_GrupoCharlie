package com.umg.proyectoanalisis.repository.sistemademenus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.sistemademenus.Menu;

@Repository("menuRepository")
public interface MenuRepository extends JpaRepository<Menu, Integer> {
}
