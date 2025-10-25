package com.umg.proyectoanalisis.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.umg.proyectoanalisis.repository.sistemademenus.RoleOpcionRepository;

@Service
public class UserRoleOptionsService {
    @Autowired
    private RoleOpcionRepository roleOpcionRepository;

    public List<Map<String, Object>> obtenerRoleOptions(String idUsuario) {
        return roleOpcionRepository.obtenerOpcionesPorUsuario(idUsuario);
    }

}
