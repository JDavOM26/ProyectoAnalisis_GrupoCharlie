package com.umg.proyectoAnalasis.securityConfig;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.security.Key;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String idUsuario, List<String> roles) {
        return Jwts.builder()
                .setSubject(idUsuario)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey()) // Eliminamos SignatureAlgorithm.HS512
                .compact();
    }

    public String getIdUsuarioFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public List<String> getRolesFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return claims.get("roles", List.class);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean validateToken(String token, String idUsuario) {
        final String username = getIdUsuarioFromToken(token);
        return (username.equals(idUsuario) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getClaimFromToken(token, Claims::getExpiration);
        return expiration.before(new Date());
    }
}