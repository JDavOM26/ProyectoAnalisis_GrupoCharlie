package com.umg.proyectoAnalasis.service;
	
import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
	import org.springframework.stereotype.Service;

	@Service
	public class UserService {
		
		@Autowired
		NamedParameterJdbcTemplate npjt;
		
		
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
		
