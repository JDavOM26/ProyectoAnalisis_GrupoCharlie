package com.umg.proyectoanalisis.controller;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.umg.proyectoanalisis.entity.principales.Empresa;
import com.umg.proyectoanalisis.entity.principales.Usuario;
import com.umg.proyectoanalisis.repository.principales.EmpresaRepository;
import com.umg.proyectoanalisis.repository.principales.UsuarioRepository;
import com.umg.proyectoanalisis.security.JwtTokenUtil;
import com.umg.proyectoanalisis.service.BitacoraAccesoService;
import com.umg.proyectoanalisis.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin
@RequestMapping("/api/noauth")
public class JwtAuthenticationController {

	@Autowired
	AuthenticationManager authenticationManager;
	@Autowired
	UsuarioRepository userRepository;
	@Autowired
	EmpresaRepository empresaRepository;
	@Autowired
	PasswordEncoder encoder;
	@Autowired
	JwtTokenUtil jwtUtils;
	@Autowired
	UserService userService;

	@Autowired
	BitacoraAccesoService bitacoraAccesoService;

	@Autowired
	private HttpServletRequest httpServletRequest;

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@RequestBody Usuario user) {
		String direccionIp = httpServletRequest.getRemoteAddr();
		String httpUserAgent = httpServletRequest.getHeader("User-agent");
		String sesion = httpServletRequest.getSession().getId();

		Usuario usr = userRepository.findByIdUsuario(user.getIdUsuario());

		if (usr == null) {
			String usuarioInexistente = "Usuario no registrado";
			bitacoraAccesoService.registrarIntentoFallido(usuarioInexistente, direccionIp, httpUserAgent,
					"USUARIO_INEXISTENTE", sesion);

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o password inválido");
		}

		if (usr.getRequiereCambiarPassword() != null) {
			int requiereCambiar = usr.getRequiereCambiarPassword();
			if (requiereCambiar == 1) {
				bitacoraAccesoService.registrarIntentoFallido(usr.getIdUsuario(), direccionIp, httpUserAgent,
						"CONTRASENA_VENCIDA", sesion);
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña vencida. Debe actualizarla.");
			} else if (requiereCambiar == 2) {
				if (usr.getUltimaFechaCambioPassword() != null) {
					long minutosTranscurridos = java.time.Duration
							.between(usr.getUltimaFechaCambioPassword(), LocalDateTime.now().minusHours(6)).toMinutes();
					if (minutosTranscurridos > 30) {

						bitacoraAccesoService.registrarIntentoFallido(usr.getIdUsuario(), direccionIp, httpUserAgent,
								"CONTRASENA_VENCIDA", sesion);
						return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
								.body("Contraseña vencida. Debe actualizarla.");
					}
				} else {

					bitacoraAccesoService.registrarIntentoFallido(usr.getIdUsuario(), direccionIp, httpUserAgent,
							"CONTRASENA_VENCIDA", sesion);
					return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
							.body("Error: Fecha de cambio de contraseña no disponible para contraseña temporal.");
				}
			}
		}

		Empresa empresa = empresaRepository.findById(1).orElse(null);
		if (empresa != null && empresa.getPasswordCantidadCaducidadDias() != null
				&& usr.getUltimaFechaCambioPassword() != null) {

			long diasTranscurridos = java.time.Duration.between(usr.getUltimaFechaCambioPassword(), LocalDateTime.now())
					.toDays();

			if (diasTranscurridos > empresa.getPasswordCantidadCaducidadDias()) {
				bitacoraAccesoService.registrarIntentoFallido(usr.getIdUsuario(), direccionIp, httpUserAgent,
						"CONTRASENA_VENCIDA", sesion);

				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña vencida. Debe actualizarla.");
			}
		}

		if (usr.getIdStatusUsuario() != null) {
			int estado = usr.getIdStatusUsuario();
			if (estado == 2) {
				bitacoraAccesoService.registrarIntentoFallido(user.getIdUsuario(), direccionIp, httpUserAgent,
						"PASSWORD_INCORRECTO", sesion);

				return ResponseEntity.status(HttpStatus.LOCKED)
						.body("Cuenta bloqueada por demasiados intentos fallidos");
			}
			if (estado == 3) {
				bitacoraAccesoService.registrarIntentoFallido(user.getIdUsuario(), direccionIp, httpUserAgent,
						"USUARIO_INACTIVO", sesion);

				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Cuenta inactiva");
			}
		}

		try {
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(user.getIdUsuario(), user.getPassword()));

			userService.manejarIntentoExitoso(user.getIdUsuario(), sesion);

			UserDetails userDetails = (UserDetails) authentication.getPrincipal();
			String jwt = jwtUtils.generateToken(userDetails.getUsername());
			Date fechaExpiracion = new Date(new Date().getTime() + 900000);

			Map<String, Object> response = new HashMap<>();
			response.put("token", jwt);
			response.put("idRol", usr.getIdRole());
			response.put("mensaje", "Login exitoso");
			response.put("expiracionToken", fechaExpiracion);

			bitacoraAccesoService.registrarAccesoExitoso(usr.getIdUsuario(), direccionIp, httpUserAgent, sesion);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			try {
				int nuevosIntentos = userService.manejarIntentoFallido(user.getIdUsuario());
				int maxIntentos = userService.obtenerMaxIntentosFallidos(user.getIdUsuario());

				bitacoraAccesoService.registrarIntentoFallido(user.getIdUsuario(), direccionIp, httpUserAgent,
						"PASSWORD_INCORRECTO", sesion);

				String mensaje = String.format("Credenciales inválidas. Intentos: %d/%d", nuevosIntentos, maxIntentos);

				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mensaje);

			} catch (RuntimeException ex) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.body("Error en el servidor: " + ex.getMessage());
			}
		}
	}

	@PostMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
		String idUsuario = request.get("idUsuario");
		String oldPassword = request.get("oldPassword");
		String newPassword = request.get("newPassword");

		if (idUsuario == null || oldPassword == null || newPassword == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Faltan parámetros requeridos.");
		}

		Usuario usr = userRepository.findByIdUsuario(idUsuario);
		if (usr == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
		}

		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(idUsuario, oldPassword));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña actual incorrecta.");
		}

		Empresa empresa = empresaRepository.findById(1).orElse(null);
		if (empresa == null) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Configuración de empresa no encontrada.");
		}

		if (!userService.validarPassword(newPassword, empresa)) {
			String errorMensaje = userService.obtenerMensajeErrorPassword(newPassword, empresa);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMensaje);
		}

		usr.setPassword(encoder.encode(newPassword));
		usr.setUltimaFechaCambioPassword(LocalDateTime.now());
		usr.setRequiereCambiarPassword(0);
		userRepository.save(usr);

		String direccionIp = httpServletRequest.getRemoteAddr();
		String httpUserAgent = httpServletRequest.getHeader("User-agent");
		String sesion = httpServletRequest.getSession().getId();
		bitacoraAccesoService.registrarCambioContraseniaExitoso(idUsuario, direccionIp, httpUserAgent, sesion);

		return ResponseEntity.ok("Contraseña actualizada correctamente.");
	}

}