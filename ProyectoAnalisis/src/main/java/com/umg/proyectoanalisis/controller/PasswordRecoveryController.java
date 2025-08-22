package com.umg.proyectoanalisis.controller;

import java.time.LocalDateTime;

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
import com.umg.proyectoanalisis.service.PasswordRecoveryService;

@RestController
@RequestMapping("/api/noauth")
public class PasswordRecoveryController {

    @Autowired
    PasswordRecoveryService passwordRecoveryService;
    @Autowired
    UsuarioRepository usuarioRepository;

    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@RequestBody EmailDTO emailDto) {
        try {
            if (emailDto == null || emailDto.getPara() == null || emailDto.getPara().isEmpty()) {
                return new ResponseEntity<>("Correo electrónico no proporcionado", HttpStatus.BAD_REQUEST);
            }
            emailDto.setAsunto("Restablecer contraseña");

            String passwordTemporal = passwordRecoveryService.actualizarContrasenaTemporal(emailDto.getIdUsuario());

            String cuerpoTextoPlano = """
                    RESTABLECIMIENTO DE CONTRASEÑA
                    ==============================

                    Estimado %s,

                    Hemos recibido una solicitud para restablecer su contraseña.

                    Su contraseña temporal es: %s

                    ⚠️ IMPORTANTE: Esta contraseña es válida por 30 minutos por motivos de seguridad.

                    Para acceder a su cuenta:
                    1. Diríjase a nuestra página de login: https://localhost:4200/login
                    2. Ingrese su usuario y la contraseña temporal
                    3. Una vez dentro, cambie su contraseña inmediatamente

                    Si usted no solicitó este restablecimiento, ignore este mensaje y contacte inmediatamente a soporte técnico.

                    Atentamente,
                    Equipo de Soporte Técnico
                    Grupo Charlie

                    ---
                    © %d Grupo Charlie
                    Este es un mensaje automático, no responda a este correo.
                    Para asistencia: soporte@grupocharlie.com
                    """
                    .formatted(emailDto.getIdUsuario(), passwordTemporal, LocalDateTime.now().getYear());

            emailDto.setCuerpo(cuerpoTextoPlano);
            passwordRecoveryService.sendEmail(emailDto);
            return new ResponseEntity<>("Correo enviado exitosamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al enviar el correo", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/obtener-pregunta")
    public ResponseEntity<PasswordRecoveryResponseDto> getPregunta(
            @RequestBody PasswordRecoveryRequestDto credenciales) {
        try {
            if (credenciales == null || credenciales.getIdUsuario() == null || credenciales.getIdUsuario().isEmpty() ||
                    credenciales.getEmail() == null || credenciales.getEmail().isEmpty()) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            Usuario usuario = usuarioRepository.findById(credenciales.getIdUsuario())
                    .orElseThrow(
                            () -> new RuntimeException("Credenciales invalidas"));

            if (!usuario.getCorreoElectronico().equals(credenciales.getEmail())) {
                return new ResponseEntity<>(new PasswordRecoveryResponseDto(), HttpStatus.NOT_FOUND);
            }

            PasswordRecoveryResponseDto respuesta = new PasswordRecoveryResponseDto();
            respuesta.setPregunta(usuario.getPregunta());
            return new ResponseEntity<>(respuesta, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(new PasswordRecoveryResponseDto(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/verificar-respuesta")
    public ResponseEntity<?> verificarRespuesta(@RequestBody ValidarRespuestaRequestDto answerDto) {
        try {
            if (answerDto == null || answerDto.getIdUsuario() == null || answerDto.getIdUsuario().isEmpty() ||
                    answerDto.getRespuesta() == null || answerDto.getRespuesta().isEmpty()) {
                return new ResponseEntity<>("Error: debe ingresar una respuesta", HttpStatus.BAD_REQUEST);
            }
            boolean isValid = passwordRecoveryService.verificarRespuesta(answerDto);
            if (!isValid) {
                isValid = false;
                return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al verificar la respuesta: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
