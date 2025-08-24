package com.umg.proyectoAnalasis.controller;

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
import com.umg.proyectoAnalasis.entity.EntidadesPrincipales.Usuario;
import com.umg.proyectoAnalasis.repository.RepositoriosPrincipales.UsuarioRepository;
import com.umg.proyectoAnalasis.security.JwtTokenUtil;
import com.umg.proyectoAnalasis.service.BitacoraAccesoService;
import com.umg.proyectoAnalasis.service.UserService;

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
    PasswordEncoder encoder;
    @Autowired
    JwtTokenUtil jwtUtils;
    @Autowired
    UserService userService;

    // Importar para la bitácora de acceso
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
            // Registrar en la bitácora intento fallido, es el mismo método para password incorrecto
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
        if (usr.getStatusUsuario() != null) {
            int estado = usr.getStatusUsuario().getIdStatusUsuario();

            if (estado == 2) { // ESTADO_BLOQUEADO  
                // Registrar en la bitácora intento fallido, es el mismo método para password incorrecto
                bitacoraAccesoService.registrarIntentoFallido(
                        user.getIdUsuario(),
                        direccionIp,
                        httpUserAgent,
                        "PASSWORD_INCORRECTO",
                        sesion);

                return ResponseEntity.status(HttpStatus.LOCKED)
                        .body("Cuenta bloqueada por demasiados intentos fallidos");
            }
            if (estado == 3) { // ESTADO_INACTIVO
                //Registrar en tabla de bitácora
                bitacoraAccesoService.registrarIntentoFallido(
                        user.getIdUsuario(),
                        direccionIp,
                        httpUserAgent,
                        "USUARIO_INACTIVO",
                        sesion);

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Cuenta inactiva");
            }
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getIdUsuario(),
                            user.getPassword()));

            // LOGIN EXITOSO
            userService.manejarIntentoExitoso(user.getIdUsuario());

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtils.generateToken(userDetails.getUsername());

            Integer idRol = usr.getRole() != null ? usr.getRole().getIdRole() : null;

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("idRol", idRol);
            response.put("mensaje", "Login exitoso");

            // Registrar en la bitácora acceso exitoso
            String usuario = usr.getIdUsuario();
            bitacoraAccesoService.registrarAccesoExitoso(usuario, direccionIp, httpUserAgent, sesion);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // LOGIN FALLIDO
            try {
                int nuevosIntentos = userService.manejarIntentoFallido(user.getIdUsuario());
                int maxIntentos = userService.obtenerMaxIntentosFallidos(user.getIdUsuario());

                // Registrar en la bitácora intento fallido
                bitacoraAccesoService.registrarIntentoFallido(
                        user.getIdUsuario(),
                        direccionIp,
                        httpUserAgent,
                        "PASSWORD_INCORRECTO",
                        sesion);

                String mensaje = String.format("Credenciales inválidas. Intentos: %d/%d",
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
    /*
     * if (usr == null) {
     * 
     * return ResponseEntity.status(HttpStatus.BAD_REQUEST)
     * .body("Usuario o password inválido");
     * }
     * 
     * 
     * if (usr.getStatusUsuario().getIdStatusUsuario()==2 && usr.getStatusUsuario()
     * != null) {
     * return ResponseEntity.status(HttpStatus.BAD_REQUEST)
     * .body("Cuenta bloqueada por demasiados intentos fallidos");
     * }
     * 
     * if (usr.getStatusUsuario().getIdStatusUsuario()==3) {
     * return ResponseEntity.status(HttpStatus.BAD_REQUEST)
     * .body("Cuenta inactiva");
     * }
     * 
     * try {
     * Authentication authentication = authenticationManager.authenticate(
     * 
     * new UsernamePasswordAuthenticationToken(
     * user.getIdUsuario(),
     * user.getPassword()
     * )
     * );
     * 
     * UserDetails userDetails = (UserDetails) authentication.getPrincipal();
     * String jwt = jwtUtils.generateToken(userDetails.getUsername());
     * 
     * return ResponseEntity.ok("token: "+jwt);
     * 
     * /*DENTRO DEL CATCH SE ESTARÁ ACTUALIZANDO intentosDeAcceso hasta llegar a la
     * cantidad
     * definida en Empresa (De momento puse 5), despues de 5 se actualiza el estado
     * del usuario
     * por lo que en el siguiente intento se detendrá el intenot de inicio de sesión
     * por el estatus (usr.getIdStatusUsuario()==2)
     */
    /*
     * } catch (Exception e) {
     * if(usr.getIntentosDeAcceso()<5) {
     * userService.actualizarUsuarioEstado(user.getIdUsuario(), 1);
     * }else {
     * 
     * userService.actualizarEstatus(user.getIdUsuario(), 2);
     * 
     * }
     * return ResponseEntity.status(HttpStatus.BAD_REQUEST)
     * .body("Usuario o password inválido");
     * }
     */
}
