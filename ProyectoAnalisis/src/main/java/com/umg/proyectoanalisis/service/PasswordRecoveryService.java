package com.umg.proyectoanalisis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import com.umg.proyectoanalisis.dto.EmailDTO;
import com.umg.proyectoanalisis.dto.requestdto.ValidarRespuestaRequestDto;
import com.umg.proyectoanalisis.entity.principales.Usuario;
import com.umg.proyectoanalisis.repository.principales.UsuarioRepository;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class PasswordRecoveryService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String email;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void sendEmail(EmailDTO emailDto) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(emailDto.getPara());
        message.setSubject(emailDto.getAsunto());
        message.setText(emailDto.getCuerpo());
        message.setFrom(email);
        mailSender.send(message);
    }

    public boolean verificarRespuesta(ValidarRespuestaRequestDto answerDto) {
        try {

            if (answerDto == null || answerDto.getIdUsuario() == null || answerDto.getIdUsuario().isEmpty() ||
                    answerDto.getRespuesta() == null || answerDto.getRespuesta().isEmpty()) {
                return false;
            }

            Usuario usuario = usuarioRepository.findById(answerDto.getIdUsuario())
                    .orElseThrow(
                            () -> new RuntimeException("Credenciales invalidas"));

            String respuestaUsuario = usuario.getRespuesta().trim().toLowerCase();
            String respuestaIngresada = answerDto.getRespuesta().trim().toLowerCase();
            return respuestaUsuario.equals(respuestaIngresada);
        } catch (RuntimeException e) {

            return false;
        } catch (Exception e) {

            return false;
        }
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
