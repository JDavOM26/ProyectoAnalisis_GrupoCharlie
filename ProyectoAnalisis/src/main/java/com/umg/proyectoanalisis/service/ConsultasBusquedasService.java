package com.umg.proyectoanalisis.service;

import java.util.List;
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
	
	


	public List<Map<String, Object>> buscarMovimientoCuenta(String valor, String tipo, int anio, int mes) {
       
        if (mes < 1 || mes > 12) {
            return List.of(); 
        }
        
        if (tipo.equals(TIPO_IDPERSONA)) {
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("idPersona", valor);
            params.addValue("anio", anio);
            params.addValue("mes", mes);
            String query = """
                SELECT 
                    mc.IdMovimientoCuenta,
                    mc.FechaMovimiento AS Fecha,
                    tmc.Nombre AS TipoMovimiento,
                    mc.Descripcion AS DocumentoReferencia,
                    CASE 
                        WHEN tmc.OperacionCuentaCorriente = 1 THEN mc.ValorMovimiento 
                        ELSE 0 
                    END AS Cargo,
                    CASE 
                        WHEN tmc.OperacionCuentaCorriente = 2 THEN mc.ValorMovimiento 
                        ELSE 0 
                    END AS Abono,
                    sc.SaldoAnterior + SUM(
                        CASE 
                            WHEN tmc.OperacionCuentaCorriente = 1 THEN mc.ValorMovimiento 
                            WHEN tmc.OperacionCuentaCorriente = 2 THEN -mc.ValorMovimiento 
                            ELSE 0 
                        END
                    ) OVER (
                        PARTITION BY mc.IdSaldoCuenta 
                        ORDER BY mc.FechaMovimiento, mc.IdMovimientoCuenta
                    ) AS SaldoAcumulado
                FROM 
                    MOVIMIENTO_CUENTA mc
                    INNER JOIN SALDO_CUENTA sc ON mc.IdSaldoCuenta = sc.IdSaldoCuenta
                    INNER JOIN TIPO_MOVIMIENTO_CXC tmc ON mc.IdTipoMovimientoCXC = tmc.IdTipoMovimientoCXC
                    INNER JOIN PERSONA p ON sc.IdPersona = p.IdPersona
                    INNER JOIN PERIODO_CIERRE_MES pcm ON mc.FechaMovimiento BETWEEN pcm.FechaInicio AND pcm.FechaFinal
                WHERE 
                    p.IdPersona = :idPersona
                    AND pcm.Anio = :anio 
                    AND pcm.Mes = :mes
                ORDER BY 
                    mc.FechaMovimiento, mc.IdMovimientoCuenta
                """;
            try {
                return npjt.queryForList(query, params);
            } catch (Exception e) {
                System.err.println("Error querying movimientos for idPersona: " + e.getMessage());
                e.printStackTrace();
                return List.of();
            }
        } else if (tipo.equals(TIPO_IDCUENTA)) {
           
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("idCuenta", valor);
            String query = "SELECT * FROM movimiento_cuenta WHERE idCuenta = :idCuenta";
            try {
                return npjt.queryForList(query, params);
            } catch (Exception e) {
                System.err.println("Error querying movimientos for idCuenta: " + e.getMessage());
                e.printStackTrace();
                return List.of();
            }
        } else if (tipo.equals(TIPO_NOMBREAPELLIDO)) {
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("nombreApellido", "%" + valor + "%"); 
            params.addValue("anio", anio);
            params.addValue("mes", mes);
            String query = """
                SELECT 
                    mc.IdMovimientoCuenta,
                    mc.FechaMovimiento AS Fecha,
                    tmc.Nombre AS TipoMovimiento,
                    mc.Descripcion AS DocumentoReferencia,
                    CASE 
                        WHEN tmc.OperacionCuentaCorriente = 1 THEN mc.ValorMovimiento 
                        ELSE 0 
                    END AS Cargo,
                    CASE 
                        WHEN tmc.OperacionCuentaCorriente = 2 THEN mc.ValorMovimiento 
                        ELSE 0 
                    END AS Abono,
                    sc.SaldoAnterior + SUM(
                        CASE 
                            WHEN tmc.OperacionCuentaCorriente = 1 THEN mc.ValorMovimiento 
                            WHEN tmc.OperacionCuentaCorriente = 2 THEN -mc.ValorMovimiento 
                            ELSE 0 
                        END
                    ) OVER (
                        PARTITION BY mc.IdSaldoCuenta 
                        ORDER BY mc.FechaMovimiento, mc.IdMovimientoCuenta
                    ) AS SaldoAcumulado
                FROM 
                    MOVIMIENTO_CUENTA mc
                    INNER JOIN SALDO_CUENTA sc ON mc.IdSaldoCuenta = sc.IdSaldoCuenta
                    INNER JOIN TIPO_MOVIMIENTO_CXC tmc ON mc.IdTipoMovimientoCXC = tmc.IdTipoMovimientoCXC
                    INNER JOIN PERSONA p ON sc.IdPersona = p.IdPersona
                    INNER JOIN PERIODO_CIERRE_MES pcm ON mc.FechaMovimiento BETWEEN pcm.FechaInicio AND pcm.FechaFinal
                WHERE 
                    CONCAT(p.Nombre, ' ', p.Apellido) LIKE :nombreApellido
                    AND pcm.Anio = :anio 
                    AND pcm.Mes = :mes
                ORDER BY 
                    mc.FechaMovimiento, mc.IdMovimientoCuenta
                """;
            try {
                List<Map<String, Object>> results = npjt.queryForList(query, params);
                System.out.println("Query results for nombreApellido: " + results);
                return results;
            } catch (Exception e) {
                System.err.println("Error querying movimientos for nombreApellido: " + e.getMessage());
                e.printStackTrace();
                return List.of();
            }
        }
        return List.of();
    }
	}