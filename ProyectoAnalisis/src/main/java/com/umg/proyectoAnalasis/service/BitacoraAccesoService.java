package com.umg.proyectoAnalasis.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.umg.proyectoAnalasis.entity.EntidadesAuditoria.BitacoraAcceso;
import com.umg.proyectoAnalasis.entity.EntidadesAuditoria.TipoAcceso;
import com.umg.proyectoAnalasis.repository.RepositoriosAuditoria.BitacoraAccesoRepository;
import com.umg.proyectoAnalasis.repository.RepositoriosAuditoria.TipoAccesoRepository;

@Service
@Transactional
public class BitacoraAccesoService {

    @Autowired
    private BitacoraAccesoRepository bitacoraAccesoRepository;

    @Autowired
    private TipoAccesoRepository tipoAccesoRepository;

    public void RegistrarAcceso(String idUsuario, String tipoAccesoNombre,
            String direccionIp, String httpUserAgent,
            String accion, String sesion) {

        BitacoraAcceso bitacora = new BitacoraAcceso();
        bitacora.setIdUsuario(idUsuario);
        bitacora.setAccion(accion);
        bitacora.setFechaAcceso(LocalDateTime.now());
        bitacora.setDireccionIp(direccionIp);
        bitacora.setHttpUserAgent(httpUserAgent);
        bitacora.setSesion(sesion);

        // Extraer información del User-Agent
        Map<String, String> userAgentInfo = parseUserAgentSimple(httpUserAgent);
        bitacora.setSistemaOperativo(userAgentInfo.get("sistemaOperativo"));
        bitacora.setDispositivo(userAgentInfo.get("dispositivo"));
        bitacora.setBrowser(userAgentInfo.get("browser"));

        // Obtener el tipo de acceso según el nombre
        TipoAcceso tipoAcceso = tipoAccesoRepository.findByNombre(tipoAccesoNombre);
        if (tipoAcceso == null) {
            // Fallback a un tipo por defecto si no se encuentra
            tipoAcceso = tipoAccesoRepository.findByNombre("Acceso Concedido");
        }
        bitacora.setTipoAcceso(tipoAcceso);

        bitacoraAccesoRepository.save(bitacora);
    }

    private Map<String, String> parseUserAgentSimple(String userAgent) {
        Map<String, String> info = new HashMap<>();

        if (userAgent == null) {
            info.put("browser", "Desconocido");
            info.put("sistemaOperativo", "Desconocido");
            info.put("dispositivo", "Desconocido");
            return info;
        }

        String userAgentLower = userAgent.toLowerCase();

        // Detectar navegador
        if (userAgentLower.contains("chrome")) {
            info.put("browser", "Chrome");
        } else if (userAgentLower.contains("firefox")) {
            info.put("browser", "Firefox");
        } else if (userAgentLower.contains("safari")) {
            info.put("browser", "Safari");
        } else if (userAgentLower.contains("edge")) {
            info.put("browser", "Edge");
        } else {
            info.put("browser", "Otro");
        }

        // Detectar sistema operativo
        if (userAgentLower.contains("windows")) {
            info.put("sistemaOperativo", "Windows");
        } else if (userAgentLower.contains("mac")) {
            info.put("sistemaOperativo", "macOS");
        } else if (userAgentLower.contains("linux")) {
            info.put("sistemaOperativo", "Linux");
        } else if (userAgentLower.contains("android")) {
            info.put("sistemaOperativo", "Android");
        } else if (userAgentLower.contains("iphone") || userAgentLower.contains("ipad")) {
            info.put("sistemaOperativo", "iOS");
        } else {
            info.put("sistemaOperativo", "Desconocido");
        }

        // Detectar dispositivo
        if (userAgentLower.contains("mobile")) {
            info.put("dispositivo", "Móvil");
        } else if (userAgentLower.contains("tablet")) {
            info.put("dispositivo", "Tablet");
        } else {
            info.put("dispositivo", "Desktop");
        }

        return info;
    }

    /**
     * Métodos específicos para diferentes tipos de acceso
     */
    public void registrarAccesoExitoso(String idUsuario, String direccionIp,
            String httpUserAgent, String sesion) {
        RegistrarAcceso(idUsuario, "Acceso Concedido", direccionIp,
                httpUserAgent, "LOGIN_EXITOSO", sesion);
    }

    public void registrarIntentoFallido(String idUsuario, String direccionIp,
            String httpUserAgent, String motivo, String sesion) {
        String tipoAcceso;
        switch (motivo) {
            case "PASSWORD_INCORRECTO":
                tipoAcceso = "Bloqueado - Password incorrecto/Numero de intentos exedidos";
                break;
            case "USUARIO_INEXISTENTE":
                tipoAcceso = "Usuario ingresado no existe";
                break;
            case "USUARIO_INACTIVO":
                tipoAcceso = "Usuario Inactivo";
                break;
            default:
                tipoAcceso = "Bloqueado - Password incorrecto/Numero de intentos exedidos";
        }

        RegistrarAcceso(idUsuario, tipoAcceso, direccionIp,
                httpUserAgent, "LOGIN_FALLIDO: " + motivo, sesion);
    }
}
