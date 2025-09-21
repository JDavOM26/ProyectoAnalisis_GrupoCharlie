package com.umg.proyectoanalisis.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;




@Service
public class ConsultasBusquedasService {
	private static final String TIPO_IDPERSONA = "porIdPersona";
	private static final String TIPO_IDCUENTA = "porIdCuenta";
	private static final String TIPO_NOMBREAPELLIDO = "porNombreApellido";
	
	
	@Autowired
	NamedParameterJdbcTemplate npjt;
	
	
	//FALTA TRABAJAR UNICAMENTE LOS DATOS NECESARIOS
	public Map<String, Object> buscarSaldoCliente(String valor, String tipo) {
        if (tipo.equals(TIPO_IDPERSONA)) {
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("idPersona", valor);
            String query = "SELECT * FROM saldo_cuenta WHERE idPersona = :idPersona";
            try {
                return npjt.queryForMap(query, params);
            } catch (Exception e) {
                return Map.of();
            }
        } else if (tipo.equals(TIPO_IDCUENTA)) {
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("idCuenta", valor);
            String query = "SELECT * FROM saldo_cuenta WHERE idCuenta = :idCuenta";
            try {
                return npjt.queryForMap(query, params);
            } catch (Exception e) {
                return Map.of();
            }
        } else if (tipo.equals(TIPO_NOMBREAPELLIDO)) {
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("nombreApellido", "%" + valor + "%"); 
            String query = "SELECT sc.* FROM saldo_cuenta sc " +
                          "INNER JOIN persona p ON sc.idPersona = p.IdPersona " +
                          "WHERE CONCAT(p.Nombre, ' ', p.Apellido) LIKE :nombreApellido";
            try {
                return npjt.queryForMap(query, params);
            } catch (Exception e) {
                return Map.of();
            }
        }

        return Map.of(); 
    }
	
	
	//==================================================================================================
	
	
	public Map<String, Object> buscarMovimientoCuenta(String valor, String tipo) {
        if (tipo.equals(TIPO_IDPERSONA)) {
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("idPersona", valor);
            String query = "SELECT * FROM movimiento_cuenta WHERE idPersona = :idPersona";
            try {
                return npjt.queryForMap(query, params);
            } catch (Exception e) {
                return Map.of();
            }
        } else if (tipo.equals(TIPO_IDCUENTA)) {
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("idCuenta", valor);
            String query = "SELECT * FROM movimiento_cuenta WHERE idCuenta = :idCuenta";
            try {
                return npjt.queryForMap(query, params);
            } catch (Exception e) {
                return Map.of();
            }
        } else if (tipo.equals(TIPO_NOMBREAPELLIDO)) {
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("nombreApellido", "%" + valor + "%"); 
            String query = "SELECT sc.* FROM movimiento_cuenta sc " +
                          "INNER JOIN persona p ON sc.idPersona = p.IdPersona " +
                          "WHERE CONCAT(p.Nombre, ' ', p.Apellido) LIKE :nombreApellido";
            try {
                return npjt.queryForMap(query, params);
            } catch (Exception e) {
                return Map.of();
            }
        }

        return Map.of(); 
    }

	
}
