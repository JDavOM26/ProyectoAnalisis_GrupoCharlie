package com.umg.proyectoanalisis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.umg.proyectoanalisis.dto.EmailDTO;
import com.umg.proyectoanalisis.dto.requestdto.PasswordRecoveryRequestDto;
import com.umg.proyectoanalisis.dto.requestdto.ValidarRespuestaRequestDto;
import com.umg.proyectoanalisis.dto.responsedto.PasswordRecoveryResponseDto;
import com.umg.proyectoanalisis.entity.principales.Usuario;
import com.umg.proyectoanalisis.repository.principales.UsuarioRepository;
import com.umg.proyectoanalisis.service.BitacoraAccesoService;
import com.umg.proyectoanalisis.service.PasswordRecoveryService;
import com.umg.proyectoanalisis.service.UserService;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/noauth")
public class PasswordRecoveryController {

    @Autowired
    private PasswordRecoveryService passwordRecoveryService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    BitacoraAccesoService bitacoraAccesoService;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @Autowired
    private UserService userService;

    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@Valid @RequestBody EmailDTO emailDto) {
        try {
            String passwordTemporal = passwordRecoveryService.actualizarContrasenaTemporal(emailDto.getIdUsuario());
            emailDto.setAsunto("Restablecer contraseña");
            passwordRecoveryService.sendEmail(emailDto, passwordTemporal);
            return new ResponseEntity<>("Correo enviado exitosamente", HttpStatus.OK);
        } catch (MessagingException e) {
            return new ResponseEntity<>("Error al enviar el correo: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/obtener-pregunta")
    public ResponseEntity<?> getPregunta(@Valid @RequestBody PasswordRecoveryRequestDto credenciales) {
        String direccionIp = httpServletRequest.getRemoteAddr();
        String httpUserAgent = httpServletRequest.getHeader("User-agent");
        String sesion = httpServletRequest.getSession().getId();
        Usuario usr = usuarioRepository.findByIdUsuario(credenciales.getIdUsuario());

        if (usr == null) {
            String usuarioInexistente = "Usuario no registrado";
            
            bitacoraAccesoService.registrarIntentoFallido(
                    usuarioInexistente,
                    direccionIp,
                    httpUserAgent,
                    "USUARIO_INEXISTENTE",
                    sesion);

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Usuario o password inválido");
        }

        // Validación del estado del usuario
        if (usr.getIdStatusUsuario() != null) {
            int estado = usr.getIdStatusUsuario();

            if (estado == 2) { // ESTADO_BLOQUEADO
                // Registrar en la bitácora intento fallido, es el mismo método para password
                // incorrecto
                bitacoraAccesoService.registrarIntentoFallido(
                        credenciales.getIdUsuario(),
                        direccionIp,
                        httpUserAgent,
                        "RESPUESTA_INCORRECTA",
                        sesion);

                return ResponseEntity.status(HttpStatus.LOCKED)
                        .body("Cuenta bloqueada por demasiados intentos fallidos");
            }
            if (estado == 3) { // ESTADO_INACTIVO
                // Registrar en tabla de bitácora
                bitacoraAccesoService.registrarIntentoFallido(
                        credenciales.getIdUsuario(),
                        direccionIp,
                        httpUserAgent,
                        "USUARIO_INACTIVO",
                        sesion);

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Cuenta inactiva");
            }
        }
        try {

            Usuario usuario = usuarioRepository.findById(credenciales.getIdUsuario())
                    .orElseThrow(
                            () -> new RuntimeException("Credenciales invalidas"));

            userService.manejarIntentoExitoso(credenciales.getIdUsuario());
            PasswordRecoveryResponseDto respuesta = new PasswordRecoveryResponseDto();
            respuesta.setPregunta(usuario.getPregunta());
            return new ResponseEntity<>(respuesta, HttpStatus.OK);
        } catch (Exception e) {
        
            try {
                int nuevosIntentos = userService.manejarIntentoFallido(credenciales.getIdUsuario());
                int maxIntentos = userService.obtenerMaxIntentosFallidos(credenciales.getIdUsuario());

             
                bitacoraAccesoService.registrarIntentoFallido(
                        credenciales.getIdUsuario(),
                        direccionIp,
                        httpUserAgent,
                        "USUARIO_INCORRECTO",
                        sesion);

                String mensaje = String.format("usuario incorrecto. Intentos: %d/%d",
                        nuevosIntentos, maxIntentos);

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(mensaje);

            } catch (RuntimeException ex) {
               
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario no encontrado");
            } catch (Exception ex) {
                
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error interno del servidor");
            }
        }
    }

    @PostMapping("/verificar-respuesta")
    public ResponseEntity<?> verificarRespuesta(@Valid @RequestBody ValidarRespuestaRequestDto answerDto) {
        String direccionIp = httpServletRequest.getRemoteAddr();
        String httpUserAgent = httpServletRequest.getHeader("User-agent");
        String sesion = httpServletRequest.getSession().getId();
        Usuario usr = usuarioRepository.findByIdUsuario(answerDto.getIdUsuario());

        if (usr == null) {
            String usuarioInexistente = "Usuario no registrado";
            // Registrar en la bitácora intento fallido, es el mismo método para password
            // incorrecto
            bitacoraAccesoService.registrarIntentoFallido(
                    usuarioInexistente,
                    direccionIp,
                    httpUserAgent,
                    "USUARIO_INEXISTENTE",
                    sesion);

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Usuario o password inválido");
        }

        // Validación del estado del usuario
        if (usr.getIdStatusUsuario() != null) {
            int estado = usr.getIdStatusUsuario();

            if (estado == 2) { // ESTADO_BLOQUEADO
                // Registrar en la bitácora intento fallido, es el mismo método para password
                // incorrecto
                bitacoraAccesoService.registrarIntentoFallido(
                        answerDto.getIdUsuario(),
                        direccionIp,
                        httpUserAgent,
                        "RESPUESTA_INCORRECTA",
                        sesion);

                return ResponseEntity.status(HttpStatus.LOCKED)
                        .body("Cuenta bloqueada por demasiados intentos fallidos");
            }
            if (estado == 3) { // ESTADO_INACTIVO
                // Registrar en tabla de bitácora
                bitacoraAccesoService.registrarIntentoFallido(
                        answerDto.getIdUsuario(),
                        direccionIp,
                        httpUserAgent,
                        "USUARIO_INACTIVO",
                        sesion);

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Cuenta inactiva");
            }
        }
        try {

            if (answerDto.getRespuesta() == null || answerDto.getRespuesta().isEmpty()) {
                return new ResponseEntity<>("Error: debe ingresar una respuesta", HttpStatus.BAD_REQUEST);
            }

            boolean isValid = passwordRecoveryService.verificarRespuesta(answerDto);
            if (!isValid) {
                isValid = false;
                return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
            }

            userService.manejarIntentoExitoso(answerDto.getIdUsuario());

            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception e) {

            try {
                int nuevosIntentos = userService.manejarIntentoFallido(answerDto.getIdUsuario());
                int maxIntentos = userService.obtenerMaxIntentosFallidos(answerDto.getIdUsuario());

                // Registrar en la bitácora intento fallido
                bitacoraAccesoService.registrarIntentoFallido(
                        answerDto.getIdUsuario(),
                        direccionIp,
                        httpUserAgent,
                        "RESPUESTA_INCORRECTA",
                        sesion);

                String mensaje = String.format("respuesta incorrecta. Intentos: %d/%d",
                        nuevosIntentos, maxIntentos);

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(mensaje);

            } catch (RuntimeException ex) {
                // En caso de error al manejar el intento fallido
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error en el servidor: " + ex.getMessage());
            }
        }
    }

}
