package com.umg.proyectoanalisis.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.umg.proyectoanalisis.securityservice.JwtUserDetailsService;

import java.io.IOException;

@Component
public class JwtAuthTokenFilter extends OncePerRequestFilter {
   //Intercepta cada solicitud HTTP para validar tokens JWT y establecer la autenticación en el contexto de seguridad.
    @Autowired
    private JwtTokenUtil jwtUtils;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String jwt = parseJwt(request); //Obtiene el token del header "Authorization"
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) { //Usa JwtTokenUtil para verificar la firma y expiración.
                String username = jwtUtils.getUsernameFromToken(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                //Crea un objeto de autenticación y lo guarda en el contexto de seguridad de Spring.
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
        	logger.error("Error al procesar la autenticación JWT: {}", e);
        }
        filterChain.doFilter(request, response); //permite que la solicitud continúe con el usuario autenticado.
    }
    
    
    //Extrae el token del header:
    private String parseJwt(HttpServletRequest request) {
        String encabezadoAuth = request.getHeader("Authorization");
        if (encabezadoAuth != null && encabezadoAuth.startsWith("Bearer ")) {
            return encabezadoAuth.substring(7); //// Elimina "Bearer "
        }
        return null;
    }
}