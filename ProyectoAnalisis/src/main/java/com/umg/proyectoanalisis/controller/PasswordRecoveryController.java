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
import com.umg.proyectoanalisis.service.PasswordRecoveryService;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/noauth")
public class PasswordRecoveryController {

    @Autowired
    private PasswordRecoveryService passwordRecoveryService;

    @Autowired
    private UsuarioRepository usuarioRepository;

   

    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@Valid @RequestBody EmailDTO emailDto) {
        try {
            String passwordTemporal = passwordRecoveryService.actualizarContrasenaTemporal(emailDto.getIdUsuario());
            emailDto.setAsunto("Restablecer contraseña");
            passwordRecoveryService.sendEmail(emailDto, passwordTemporal);
            return new ResponseEntity<>("Correo enviado exitosamente", HttpStatus.OK);
        } catch (MessagingException e) {
            return new ResponseEntity<>("Error al enviar el correo: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/obtener-pregunta")
    public ResponseEntity<PasswordRecoveryResponseDto> getPregunta(@Valid @RequestBody PasswordRecoveryRequestDto credenciales) {
        try {
           
            Usuario usuario = usuarioRepository.findById(credenciales.getIdUsuario())
                    .orElseThrow(
                            () -> new RuntimeException("Credenciales invalidas"));

          

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
    public ResponseEntity<?> verificarRespuesta(@Valid @RequestBody ValidarRespuestaRequestDto answerDto) {
        try {
            if (answerDto.getRespuesta() == null || answerDto.getRespuesta().isEmpty()) {
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
