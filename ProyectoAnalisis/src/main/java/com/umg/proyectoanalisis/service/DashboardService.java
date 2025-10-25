package com.umg.proyectoanalisis.service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private NamedParameterJdbcTemplate npjt;

    public Map<String, Object> obtenerEstadisticasCompletas() {
        Map<String, Object> resultado = new HashMap<>();

      
        String queryMovimientos = """
            SELECT 
                DATE_FORMAT(mc.FechaMovimiento, '%Y-%m') as Mes,
                MONTHNAME(mc.FechaMovimiento) as NombreMes,
                COALESCE(SUM(mc.ValorMovimiento), 0) as TotalMovimientos
            FROM MOVIMIENTO_CUENTA mc
            WHERE mc.FechaMovimiento >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(mc.FechaMovimiento, '%Y-%m'), MONTHNAME(mc.FechaMovimiento)
            ORDER BY Mes
        """;
        List<Map<String, Object>> movimientos = npjt.queryForList(queryMovimientos, new MapSqlParameterSource());
        resultado.put("movimientosMensuales", movimientos);


        return resultado;
    }

   
}