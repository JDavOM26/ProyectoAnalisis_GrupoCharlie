package com.umg.proyectoanalisis.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;




@Service
public class ConsultasBusquedasService {
   
	
	@Autowired
	NamedParameterJdbcTemplate npjt;
	
	
	
	public Map<String, Object> buscarSaldoCliente(String valor, String campo) {
	    MapSqlParameterSource params = new MapSqlParameterSource();
	    params.addValue("valor", valor);
	    params.addValue("campo", campo);
	    
	    String query = """
	        SELECT 
	            sc.IdSaldoCuenta, sc.IdPersona, sc.IdStatusCuenta, sc.IdTipoSaldoCuenta,
	            sc.SaldoAnterior AS SaldoInicial, sc.Debitos AS Cargos, sc.Creditos AS Abonos,
	            sc.SaldoAnterior + sc.Debitos - sc.Creditos AS SaldoActual,
	            sc.FechaCreacion, sc.UsuarioCreacion, sc.FechaModificacion, sc.UsuarioModificacion,
	            CONCAT(p.Nombre, ' ', p.Apellido) AS NombreCompleto
	        FROM saldo_cuenta sc
	            INNER JOIN persona p ON sc.IdPersona = p.IdPersona
	        WHERE FIELD(:campo, 'idPersona', 'idSaldoCuenta', 'nombreApellido') > 0
	            AND (
	                (:campo = 'idPersona' AND sc.IdPersona = :valor)
	                OR (:campo = 'idSaldoCuenta' AND sc.IdSaldoCuenta = :valor)
	                OR (:campo = 'nombreApellido' AND CONCAT(p.Nombre, ' ', p.Apellido) LIKE CONCAT('%', :valor, '%'))
	            )
	        LIMIT 1
	        """;
	    
	    try {
	        Map<String, Object> result = npjt.queryForMap(query, params);
	        System.out.println("Saldo encontrado para campo=" + campo + ": " + result);
	        return result;
	    } catch (Exception e) {
	        System.err.println("Error querying saldo for campo=" + campo + ": " + e.getMessage());
	        e.printStackTrace();
	        return Map.of();
	    }
	}
     
	
	
	//==================================================================================================
	
	


	public List<Map<String, Object>> buscarMovimientoCuenta(String valor, String campo, int anio, int mes) {
	    if (mes < 1 || mes > 12) return List.of();

	    MapSqlParameterSource params = new MapSqlParameterSource();
	    params.addValue("valor", valor);
	    params.addValue("campo", campo);
	    params.addValue("anio", anio);
	    params.addValue("mes", mes);

	    String query = """
	        SELECT
	            mc.IdMovimientoCuenta, 
	            mc.FechaMovimiento AS Fecha, 
	            tmc.Nombre AS TipoMovimiento,
	            mc.Descripcion AS DocumentoReferencia,
	            CONCAT(p.Nombre, ' ', p.Apellido) AS NombreCompleto,
	            p.Nombre AS NombrePersona,
	            p.Apellido AS ApellidoPersona,
	            sc.IdSaldoCuenta AS NumeroCuenta,
	            CASE WHEN tmc.OperacionCuentaCorriente = 1 THEN mc.ValorMovimiento ELSE 0 END AS Cargo,
	            CASE WHEN tmc.OperacionCuentaCorriente = 2 THEN mc.ValorMovimiento ELSE 0 END AS Abono,
	            sc.SaldoAnterior + SUM(
	                CASE WHEN tmc.OperacionCuentaCorriente = 1 THEN mc.ValorMovimiento
	                     WHEN tmc.OperacionCuentaCorriente = 2 THEN -mc.ValorMovimiento ELSE 0 END
	            ) OVER (PARTITION BY mc.IdSaldoCuenta ORDER BY mc.FechaMovimiento, mc.IdMovimientoCuenta) AS SaldoAcumulado
	        FROM MOVIMIENTO_CUENTA mc
	        INNER JOIN SALDO_CUENTA sc ON mc.IdSaldoCuenta = sc.IdSaldoCuenta
	        INNER JOIN TIPO_MOVIMIENTO_CXC tmc ON mc.IdTipoMovimientoCXC = tmc.IdTipoMovimientoCXC
	        INNER JOIN PERSONA p ON sc.IdPersona = p.IdPersona
	        INNER JOIN PERIODO_CIERRE_MES pcm ON mc.FechaMovimiento BETWEEN pcm.FechaInicio AND pcm.FechaFinal
	        WHERE pcm.Anio = :anio AND pcm.Mes = :mes
	        AND FIELD(:campo, 'idPersona', 'idSaldoCuenta', 'nombreApellido') > 0
	        AND (
	            (:campo = 'idPersona' AND p.IdPersona = :valor)
	            OR (:campo = 'idSaldoCuenta' AND mc.IdSaldoCuenta = :valor)
	            OR (:campo = 'nombreApellido' AND CONCAT(p.Nombre, ' ', p.Apellido) LIKE CONCAT('%', :valor, '%'))
	        )
	        ORDER BY mc.FechaMovimiento, mc.IdMovimientoCuenta
	        """;

	    try {
	        return npjt.queryForList(query, params);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return List.of();
	    }
	}
}