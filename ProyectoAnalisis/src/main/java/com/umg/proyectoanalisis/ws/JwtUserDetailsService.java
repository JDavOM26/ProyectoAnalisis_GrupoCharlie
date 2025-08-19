package com.umg.proyectoanalisis.ws;

import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.umg.proyectoanalisis.entity.principales.Usuario;
import com.umg.proyectoanalisis.repository.principales.UsuarioRepository;
@Service
public class JwtUserDetailsService  implements UserDetailsService {
    @Autowired
    private UsuarioRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String idUsuario){
        Usuario user = userRepository.findByIdUsuario(idUsuario);
        
     
        
        return new org.springframework.security.core.userdetails.User(
                user.getIdUsuario(),
                user.getPassword(),
                Collections.emptyList()
        );
        }
        	
        
    
}
