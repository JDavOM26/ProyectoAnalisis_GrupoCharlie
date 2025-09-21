package com.umg.proyectoanalisis.repository.sistemademenus;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.umg.proyectoanalisis.entity.sistemademenus.RoleOpcion;
import com.umg.proyectoanalisis.entity.sistemademenus.RoleOpcionId;

@Repository("roleOpcionRepository")
public interface RoleOpcionRepository extends JpaRepository<RoleOpcion, RoleOpcionId> {
    @Query(value = """
            SELECT
                m.Nombre AS modulo,
                me.Nombre AS menu,
                o.Nombre AS opcion,
                o.Pagina AS pagina,
                ro.Alta AS alta,
                ro.Baja AS baja,
                ro.Cambio AS cambio,
                ro.Imprimir AS imprimir,
                ro.Exportar AS exportar,
                o.IdOpcion AS idOpcion
            FROM USUARIO u
            INNER JOIN ROLE r ON u.IdRole = r.IdRole
            INNER JOIN ROLE_OPCION ro ON r.IdRole = ro.IdRole
            INNER JOIN OPCION o ON ro.IdOpcion = o.IdOpcion
            INNER JOIN MENU me ON o.IdMenu = me.IdMenu
            INNER JOIN MODULO m ON me.IdModulo = m.IdModulo
            WHERE u.IdUsuario = :idUsuario
            ORDER BY m.OrdenMenu, me.OrdenMenu, o.OrdenMenu
            """, nativeQuery = true)
    List<Map<String, Object>> obtenerOpcionesPorUsuario(@Param("idUsuario") String idUsuario);
}