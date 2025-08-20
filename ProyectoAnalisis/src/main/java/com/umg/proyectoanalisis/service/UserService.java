package com.umg.proyectoanalisis.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

	NamedParameterJdbcTemplate npjt;
	private LocalDateTime fechaModificacion;
	private String usuarioModificacion;
	private String usuarioCreacion;

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
	public boolean registrarUsuario(Usuario user, int idEmpresa) {
		usuarioCreacion = "system";

		if (usuarioRepository.existsByIdUsuario(user.getIdUsuario())) {
			return false;
		}

		Empresa empresa = empresaRepository.findById(idEmpresa)
				.orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

		if (!validarPassword(user.getPassword(), empresa)) {
			return false;
		}

		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setFechaCreacion(LocalDateTime.now());
		user.setUsuarioCreacion(usuarioCreacion);
		user.setIntentosDeAcceso(0);
		user.setRequiereCambiarPassword(0);

		StatusUsuario status = statusUsuarioRepository.findById(1)
				.orElseThrow(() -> new RuntimeException("StatusUsuario no encontrado"));

		user.setStatusUsuario(status);
		user.setUltimaFechaCambioPassword(LocalDateTime.now());
		usuarioRepository.save(user);
		return true;
	}

}
