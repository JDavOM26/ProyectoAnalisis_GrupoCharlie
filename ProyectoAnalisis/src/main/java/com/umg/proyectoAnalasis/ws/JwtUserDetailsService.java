package com.umg.proyectoAnalasis.ws;

import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.umg.proyectoAnalasis.entity.Usuario;
import com.umg.proyectoAnalasis.repository.UserRepository;
@Service
public class JwtUserDetailsService  implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    
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
