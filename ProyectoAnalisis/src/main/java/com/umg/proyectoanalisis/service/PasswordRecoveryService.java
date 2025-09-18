package com.umg.proyectoanalisis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.springframework.beans.factory.annotation.Value;
import com.umg.proyectoanalisis.dto.EmailDTO;
import com.umg.proyectoanalisis.dto.requestdto.ValidarRespuestaRequestDto;
import com.umg.proyectoanalisis.entity.principales.Usuario;
import com.umg.proyectoanalisis.repository.principales.UsuarioRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class PasswordRecoveryService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired

    private TemplateEngine templateEngine;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private String loginUrl = "http://localhost:4200/login";

    public void sendEmail(EmailDTO emailDto, String passwordTemporal) throws MessagingException {
        try {
            // Procesar la plantilla Thymeleaf
            Context context = new Context();
            context.setVariable("idUsuario", emailDto.getIdUsuario());
            context.setVariable("passwordTemporal", passwordTemporal);
            context.setVariable("year", LocalDateTime.now().getYear());
            context.setVariable("loginUrl", loginUrl);
            String cuerpoHtml = templateEngine.process("password_recovery_email", context);

            // Crear mensaje MIME para HTML
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(emailDto.getPara());
            helper.setSubject(emailDto.getAsunto());
            helper.setText(cuerpoHtml, true); // true indica que el contenido es HTML
            helper.setFrom(fromEmail);

            // Enviar correo
            mailSender.send(message);
        } catch (MailException | MessagingException e) {
            throw new MessagingException("Error al enviar el correo: " + e.getMessage(), e);
        }
    }

    public boolean verificarRespuesta(ValidarRespuestaRequestDto answerDto) {
        // Validaciones iniciales
        if (answerDto == null || answerDto.getIdUsuario() == null || answerDto.getIdUsuario().isEmpty() ||
                answerDto.getRespuesta() == null || answerDto.getRespuesta().isEmpty()) {
            throw new RuntimeException("Datos de respuesta inválidos");
        }

        Usuario usuario = usuarioRepository.findById(answerDto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Credenciales invalidas"));

        String respuestaUsuario = usuario.getRespuesta().trim().toLowerCase();
        String respuestaIngresada = answerDto.getRespuesta().trim().toLowerCase();

        boolean esRespuestaCorrecta = respuestaUsuario.equals(respuestaIngresada);

        if (!esRespuestaCorrecta) {
            // IMPORTANTE: Lanzar excepción para que el controlador maneje los intentos
            // fallidos
            throw new RuntimeException("Respuesta incorrecta");
        }

        return true; // Solo se llega aquí si la respuesta es correcta
    }

    public String actualizarContrasenaTemporal(String idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Credenciales invalidas"));
        String newPassword = generarContrasenaTemporal();
        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuario.setUltimaFechaCambioPassword(LocalDateTime.now().plusMinutes(30));
        usuario.setFechaModificacion(LocalDateTime.now());
        usuario.setUsuarioModificacion("Administrador");
        usuarioRepository.save(usuario);
        return newPassword;
    }

    public static String generarContrasenaTemporal() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[8];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
                .substring(0, 8);
    }

}
