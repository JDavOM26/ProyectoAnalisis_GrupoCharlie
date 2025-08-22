package com.umg.proyectoAnalasis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    NamedParameterJdbcTemplate npjt;

    // Asignar valores de la tabla de estatus.
    private static final int ESTADO_ACTIVO = 1;
    private static final int ESTADO_BLOQUEADO = 2;
    private static final int ESTADO_INACTIVO = 3;

    // Método para obtener el estatus actual del usuario.
    private int obtenerStatusUsuario(String idUsuario) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("idUsuario", idUsuario);

        String query = "SELECT idstatususuario FROM USUARIO where idusuario = :idUsuario";

        try {
            Integer status = npjt.queryForObject(query, params, Integer.class);
            return status;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener estatus de usuario: " + idUsuario);
        }
    }

    public void manejarIntentoExitoso(String idUsuario) {
        int estadoActual = obtenerStatusUsuario(idUsuario);

        // Solo resetear si no está bloqueado
        if (estadoActual == ESTADO_BLOQUEADO || estadoActual == ESTADO_INACTIVO) {
            throw new RuntimeException("Usuario bloqueado o inactivo, no se puede resetear intentos: " + idUsuario);
        }

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("idUsuario", idUsuario);
        params.addValue("estadoActivo", ESTADO_ACTIVO);

        String query = "UPDATE USUARIO SET IntentosDeAcceso = 0, IdStatusUsuario = :estadoActivo " +
                "WHERE IdUsuario = :idUsuario";

        int updated = npjt.update(query, params);

        if (updated == 0) {
            throw new RuntimeException("Usuario no encontrado: " + idUsuario);
        }
    }

    public int manejarIntentoFallido(String idUsuario) {
        int estadoActual = obtenerStatusUsuario(idUsuario);
        // Si ya está bloqueado, no hacer nada
        if (estadoActual == ESTADO_BLOQUEADO) {
            return obtenerIntentosFallidos(idUsuario); // Retorna intentos actuales
        }

        int maxIntentosPermitidos = obtenerMaxIntentosFallidos(idUsuario);
        int nuevosIntentos = incrementarIntentosFallidos(idUsuario);

        if (nuevosIntentos >= maxIntentosPermitidos) {
            bloquearUsuario(idUsuario);
        }
        return nuevosIntentos;
    }

    public int obtenerMaxIntentosFallidos(String idusuario) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("idusuario", idusuario);

        String query = "SELECT emp.passwordintentosantesdebloquear " +
                "FROM USUARIO as usuario " +
                "INNER JOIN SUCURSAL as suc ON usuario.idsucursal = suc.idsucursal " +
                "INNER JOIN Empresa as emp ON suc.idempresa = emp.idempresa " +
                "WHERE usuario.IdUsuario = :idUsuario";
        try {
            Integer maxIntentos = npjt.queryForObject(query, params, Integer.class);
            return maxIntentos != null ? maxIntentos : 5;
        } catch (Exception e) {
            return 5;
        }
    }

    private int incrementarIntentosFallidos(String idUsuario) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("idUsuario", idUsuario);

        // 1. PRIMERO incrementamos el contador
        String updateQuery = "UPDATE USUARIO SET IntentosDeAcceso = COALESCE(IntentosDeAcceso, 0) + 1 " +
                "WHERE IdUsuario = :idUsuario";

        int updated = npjt.update(updateQuery, params);

        if (updated == 0) {
            throw new RuntimeException("Usuario no encontrado: " + idUsuario);
        }

        String selectQuery = "SELECT COALESCE(IntentosDeAcceso, 0) FROM USUARIO WHERE IdUsuario = :idUsuario";

        try {
            return npjt.queryForObject(selectQuery, params, Integer.class);
        } catch (EmptyResultDataAccessException e) {
            throw new RuntimeException("Usuario no encontrado después de actualizar: " + idUsuario);
        }
    }

    private void bloquearUsuario(String idUsuario) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("idUsuario", idUsuario);
        params.addValue("estadoBloqueado", ESTADO_BLOQUEADO);

        String query = "UPDATE USUARIO SET IdStatusUsuario = :estadoBloqueado " +
                "WHERE IdUsuario = :idUsuario";

        int updated = npjt.update(query, params);

        if (updated == 0) {
            throw new RuntimeException("Usuario no encontrado al intentar bloquear: " + idUsuario);
        }
    }

    public int obtenerIntentosFallidos(String idUsuario) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("idUsuario", idUsuario);

        String query = "SELECT COALESCE(IntentosDeAcceso, 0) FROM USUARIO WHERE IdUsuario = :idUsuario";

        try {
            return npjt.queryForObject(query, params, Integer.class);
        } catch (EmptyResultDataAccessException e) {
            throw new RuntimeException("Usuario no encontrado: " + idUsuario);
        }
    }

    /*
     * public int actualizarUsuarioEstado(String idUsuario, int valor) {
     * String query = String.format(
     * "UPDATE USUARIO SET IntentosDeAcceso = IntentosDeAcceso + '%s' WHERE IdUsuario = '%s'"
     * ,
     * valor, idUsuario);
     * return npjt.getJdbcTemplate().update(query);
     * }
     * 
     * /*
     * 1 = activo
     * 2 = Bloqueado
     * 3 = inactivo
     * Validar en la DB
     */

    /*
     * public int actualizarEstatus(String idUsuario, int valor) {
     * String query = String.format(
     * "UPDATE USUARIO SET IdStatusUsuario = '%s' WHERE IdUsuario = '%s'",
     * valor, idUsuario);
     * return npjt.getJdbcTemplate().update(query);
     * }
     */
}
