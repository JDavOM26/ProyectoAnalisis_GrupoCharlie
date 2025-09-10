package com.umg.proyectoanalisis.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.umg.proyectoanalisis.dto.requestdto.postdtos.UsuarioPostDto;
import com.umg.proyectoanalisis.entity.principales.Empresa;
import com.umg.proyectoanalisis.entity.principales.StatusUsuario;
import com.umg.proyectoanalisis.entity.principales.Usuario;
import com.umg.proyectoanalisis.repository.principales.EmpresaRepository;
import com.umg.proyectoanalisis.repository.principales.StatusUsuarioRepository;
import com.umg.proyectoanalisis.repository.principales.UsuarioRepository;

@Service
public class UserService {

	// Necesario para saber como Empresa rige la contrasena
	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private EmpresaRepository empresaRepository;

	@Autowired
	private StatusUsuarioRepository statusUsuarioRepository;

	// CON ESTO SE ENCRIPTA LA CONTRASEÑA DEL USUARIO CREADO
	@Autowired
	private PasswordEncoder passwordEncoder;

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

	public void manejarIntentoExitoso(String idUsuario, String sesion) {
		int estadoActual = obtenerStatusUsuario(idUsuario);

		// Solo resetear si no está bloqueado
		if (estadoActual == ESTADO_BLOQUEADO || estadoActual == ESTADO_INACTIVO) {
			throw new RuntimeException("Usuario bloqueado o inactivo, no se puede resetear intentos: " + idUsuario);
		}

		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("idUsuario", idUsuario);
		params.addValue("estadoActivo", ESTADO_ACTIVO);
		params.addValue("fechaIngreso", LocalDateTime.now());
		params.addValue("sesionActual", sesion);

		String query = "UPDATE USUARIO SET IntentosDeAcceso = 0, UltimaFechaIngreso = :fechaIngreso, sesionActual= :sesionActual, IdStatusUsuario = :estadoActivo "
				+
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

	// Validación de contraseña basada en Empresa: ahora solo devuelve true/false
	private boolean validarPassword(String password, Empresa empresa) {
		if (password == null)
			return false;

		long mayus = password.chars().filter(Character::isUpperCase).count();
		long minus = password.chars().filter(Character::isLowerCase).count();
		long numeros = password.chars().filter(Character::isDigit).count();
		long especiales = password.chars().filter(ch -> !Character.isLetterOrDigit(ch)).count();

		if (password.length() < empresa.getPasswordLargo())
			return false;
		if (mayus < empresa.getPasswordCantidadMayusculas())
			return false;
		if (minus < empresa.getPasswordCantidadMinusculas())
			return false;
		if (numeros < empresa.getPasswordCantidadNumeros())
			return false;
		if (especiales < empresa.getPasswordCantidadCaracteresEspeciales())
			return false;

		return true;
	}

	// Registro de usuario
	public boolean registrarUsuario(UsuarioPostDto userDto, int idEmpresa) {

		if (usuarioRepository.existsByIdUsuario(userDto.getIdUsuario())) {
			return false;
		}

		Empresa empresa = empresaRepository.findById(idEmpresa)
				.orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

		if (!validarPassword(userDto.getPassword(), empresa)) {
			return false;
		}

		Usuario user = new Usuario();

		user.setIdUsuario(userDto.getIdUsuario());
		user.setNombre(userDto.getNombre());
		user.setApellido(userDto.getApellido());
		user.setFechaNacimiento(userDto.getFechaNacimiento());
		user.setIdGenero(userDto.getIdGenero());
		user.setIdRole(userDto.getIdRole());
		user.setIdSucursal(userDto.getIdSucursal());
		user.setPregunta(userDto.getPregunta());
		user.setRespuesta(userDto.getRespuesta());

		user.setCorreoElectronico(userDto.getCorreoElectronico());
		user.setTelefonoMovil(userDto.getTelefonoMovil());

		user.setPassword(passwordEncoder.encode(userDto.getPassword()));
		user.setFechaCreacion(LocalDateTime.now());
		user.setUsuarioCreacion(userDto.getIdUsuario());
		user.setIntentosDeAcceso(0);
		user.setRequiereCambiarPassword(0);
		user.setUltimaFechaCambioPassword(LocalDateTime.now());

		StatusUsuario status = statusUsuarioRepository.findById(1)
				.orElseThrow(() -> new RuntimeException("StatusUsuario no encontrado"));
		user.setIdStatusUsuario(status.getIdStatusUsuario());

		usuarioRepository.save(user);
		return true;
	}

}