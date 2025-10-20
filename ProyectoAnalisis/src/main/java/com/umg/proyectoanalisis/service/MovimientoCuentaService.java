package com.umg.proyectoanalisis.service;

import java.sql.Timestamp;
import org.springframework.stereotype.Service;
import com.umg.proyectoanalisis.dto.MovimientoCuentaRequest;
import com.umg.proyectoanalisis.repository.movCuenta.MovimientoCuentaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovimientoCuentaService {

    private final MovimientoCuentaRepository movimientoCuentaRepository;

    @Transactional
    public void registrarMovimiento(MovimientoCuentaRequest request){
        movimientoCuentaRepository.registrarMovimiento(
            request.getIdSaldoCuenta(),
            request.getIdTipoMovimientoCXC(),
            Timestamp.valueOf(request.getFechaMovimiento()),
            request.getValorMovimiento(),
            request.getDescripcion(),
            request.getUsuarioCreacion()
        );
    }
}
