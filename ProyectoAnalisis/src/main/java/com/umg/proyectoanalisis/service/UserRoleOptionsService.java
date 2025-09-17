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

        String query = """
        SELECT 
            m.idModulo,
            m.Nombre AS Modulo,
            me.idMenu,
            me.Nombre AS Menu,
            o.IdOpcion,
            o.Nombre AS Opcion,
            o.Pagina,
            ro.Alta,
            ro.Baja,
            ro.Cambio,
            ro.Imprimir,
            ro.Exportar
        FROM 
            USUARIO u
            INNER JOIN ROLE r ON u.IdRole = r.IdRole
            INNER JOIN ROLE_OPCION ro ON r.IdRole = ro.IdRole
            INNER JOIN OPCION o ON ro.IdOpcion = o.IdOpcion
            INNER JOIN MENU me ON o.IdMenu = me.IdMenu
            INNER JOIN MODULO m ON me.IdModulo = m.IdModulo
        WHERE 
            u.IdUsuario = ?
        ORDER BY 
            m.OrdenMenu, me.OrdenMenu, o.OrdenMenu;
                      """;
        return npjt.getJdbcTemplate().queryForList(query, idUsuario);

    }

}
