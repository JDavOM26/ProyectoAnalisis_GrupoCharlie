package com.umg.proyectoanalisis.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.umg.proyectoanalisis.ws.JwtUserDetailsService;


@Configuration
public class WebSecurityConfig {
    
    @Autowired
    JwtUserDetailsService userDetailsService;
    
    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;
    
    @Autowired
    private JwtAuthTokenFilter jwtAuthTokenFilter; 
    
    
    @Bean
     AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

   
    @Bean
     PasswordEncoder passwordEncoder() {
    	return new BCryptPasswordEncoder();
    }
    
   
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
       
        http
            .csrf(csrf -> csrf.disable()) 
            .cors(cors -> cors.disable()) 
            .exceptionHandling(exceptionHandling ->
                exceptionHandling.authenticationEntryPoint(unauthorizedHandler)
            )
            .sessionManagement(sessionManagement ->
            //STATELESS, no guarda información de sesión del usuario en el servidor entre peticiones.
                sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(authorizeRequests ->
                authorizeRequests
                    .requestMatchers("/api/noauth/**").permitAll()
                    .anyRequest().authenticated()
            );
        
        // Añade JwtAuthTokenFilter antes del filtro de autenticación estándar.
        http.addFilterBefore(jwtAuthTokenFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}