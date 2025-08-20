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

    //Asignar valores de la tabla de estatus.
    private static final int ESTADO_ACTIVO = 1;
    private static final int ESTADO_BLOQUEADO = 2;

	private int obtenerMaxIntentosFallidos(String idusuario){
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
		
	public void manejarIntentoExitoso(String idUsuario) {
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
        int maxIntentosPermitidos = obtenerMaxIntentosFallidos(idUsuario);
        int nuevosIntentos = incrementarIntentosFallidos(idUsuario);
        
        if (nuevosIntentos >= maxIntentosPermitidos) {
            bloquearUsuario(idUsuario);
        }
        
        return nuevosIntentos;
    }

	private int incrementarIntentosFallidos(String idUsuario) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("idUsuario", idUsuario);
        
        // Query que incrementa y retorna el nuevo valor
        String query = "UPDATE USUARIO SET IntentosDeAcceso = IntentosDeAcceso + 1 " +
                      "WHERE IdUsuario = :idUsuario " +
                      "RETURNING IntentosDeAcceso";
        
        try {
            return npjt.queryForObject(query, params, Integer.class);
        } catch (EmptyResultDataAccessException e) {
            throw new RuntimeException("Usuario no encontrado: " + idUsuario);
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
        
        String query = "SELECT IntentosDeAcceso FROM USUARIO WHERE IdUsuario = :idUsuario";
        
        try {
            return npjt.queryForObject(query, params, Integer.class);
        } catch (EmptyResultDataAccessException e) {
            throw new RuntimeException("Usuario no encontrado: " + idUsuario);
        }
    }
		
		public int actualizarUsuarioEstado (String idUsuario, int valor) {  
			String query = String.format(
		        "UPDATE USUARIO SET IntentosDeAcceso = IntentosDeAcceso + '%s' WHERE IdUsuario = '%s'",
		        valor, idUsuario
		    );
		    return npjt.getJdbcTemplate().update(query);
		}
		/*
		 * 1 = activo
		 * 2 = Bloqueado
		 * 3 = inactivo
		 * Validar en la DB
		 */
		public int actualizarEstatus (String idUsuario, int valor) {  
			String query = String.format(
		        "UPDATE USUARIO SET IdStatusUsuario = '%s' WHERE IdUsuario = '%s'",
		        valor,  idUsuario
		    );
		    return npjt.getJdbcTemplate().update(query);
		}
		
		
		
		
		}
		
