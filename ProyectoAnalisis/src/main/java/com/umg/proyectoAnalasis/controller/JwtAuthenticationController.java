package com.umg.proyectoAnalasis.controller;

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
import com.umg.proyectoAnalasis.service.UserService;

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

  
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Usuario user) {
    	 Usuario usr = userRepository.findByIdUsuario(user.getIdUsuario());
    	 
    	 if (usr == null) {
    	   
    	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
    	                .body("Usuario o password inválido");
    	    }
    	   

    	    if (usr.getStatusUsuario().getIdStatusUsuario()==2 && usr.getStatusUsuario() != null) {
    	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
    	                .body("Cuenta bloqueada por demasiados intentos fallidos");
    	    }
    	    
    	    if (usr.getStatusUsuario().getIdStatusUsuario()==3) {
    	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
    	                .body("Cuenta inactiva");
    	    }
    	    
        try {
            Authentication authentication = authenticationManager.authenticate(
           
                new UsernamePasswordAuthenticationToken(
                    user.getIdUsuario(),
                    user.getPassword()
                )
            );
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtils.generateToken(userDetails.getUsername());
            
            return ResponseEntity.ok("token: "+jwt);
            
        /*DENTRO DEL CATCH SE ESTARÁ ACTUALIZANDO intentosDeAcceso hasta llegar a la cantidad
          definida en Empresa (De momento puse 5), despues de 5 se actualiza el estado del usuario
          por lo que en el siguiente intento se detendrá el intenot de inicio de sesión 
          por el estatus (usr.getIdStatusUsuario()==2)
        */
        } catch (Exception e) {
        	if(usr.getIntentosDeAcceso()<5) {
        	userService.actualizarUsuarioEstado(user.getIdUsuario(), 1);
        	}else {
        		
        		userService.actualizarEstatus(user.getIdUsuario(), 2);
        		
        	}
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Usuario o password inválido");
        }
    }
    
  
    
   
}