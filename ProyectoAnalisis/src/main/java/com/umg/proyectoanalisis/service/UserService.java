package com.umg.proyectoanalisis.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	
	@Autowired
	NamedParameterJdbcTemplate npjt;
	private LocalDateTime fechaModificacion;
	private String usuarioModificacion;

	public int actualizarIntentosDeAcceso(String idUsuario, int valor) {
		usuarioModificacion = "system";
		fechaModificacion = LocalDateTime.now();
		String query = """
				UPDATE USUARIO SET IntentosDeAcceso = IntentosDeAcceso + ?, FechaModificacion = ?, usuarioModificacion = ? WHERE IdUsuario = ?""";
		return npjt.getJdbcTemplate().update(query, valor, fechaModificacion, usuarioModificacion, idUsuario);
	}

	/*
	 * 1 = activo
	 * 2 = Bloqueado
	 * 3 = inactivo
	 * Validar en la DB
	 */
	public int actualizarEstatus(String idUsuario, int valor) {
		usuarioModificacion = "system";
		fechaModificacion = LocalDateTime.now();
		String query = """
				    UPDATE USUARIO SET IdStatusUsuario = ?, FechaModificacion = ?, usuarioModificacion = ? WHERE IdUsuario = ?
				""";
		return npjt.getJdbcTemplate().update(query, valor, fechaModificacion, usuarioModificacion, idUsuario);
	}

}
