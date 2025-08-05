package com.umg.proyectoAnalasis.controller;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.umg.proyectoAnalasis.entity.Usuario;
import com.umg.proyectoAnalasis.repository.UserRepository;
import com.umg.proyectoAnalasis.security.JwtTokenUtil;
import com.umg.proyectoAnalasis.service.UserService;

@RestController
@CrossOrigin
@RequestMapping("/api/noauth")
public class JwtAuthenticationController {

  
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
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
    	   

    	    if (usr.getIdStatusUsuario()==2) {
    	    	if(LocalDateTime.now().isBefore(usr.getFechabloqueo())) {
    	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
    	                .body("Cuenta bloqueada por demasiados intentos fallidos");
    	    	}else {
    	    		
    	    		userService.actualizarEstatus(user.getIdUsuario(), 1);
    	    	
    	    		
    	    	}
    	    }
    	    
    	    if (usr.getIdStatusUsuario()==3) {
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
    
    //Pendiente de trabajar
    @PostMapping("/signup")
    public String registerUser(@RequestBody Usuario user) {
        if (userRepository.existsByIdUsuario(user.getIdUsuario())) {
            return "Error: username ya tomado!";
        }
        
        Usuario newUser = new Usuario();
            
                newUser.setIdUsuario(user.getIdUsuario());
                newUser.setPassword( encoder.encode(user.getPassword()));
        userRepository.save(newUser);
        return "Usuario registrado exitosamente!";
    }
}
