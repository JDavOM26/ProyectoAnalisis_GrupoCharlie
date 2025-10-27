DROP PROCEDURE IF EXISTS sp_registrar_movimiento_cuenta;

DELIMITER $$

CREATE PROCEDURE sp_registrar_movimiento_cuenta(
    IN p_idSaldoCuenta INT,
    IN p_idTipoMovimientoCXC INT,
    IN p_fechaMovimiento DATETIME,
    IN p_valorMovimiento DECIMAL(10,2),
    IN p_descripcion VARCHAR(75),
    IN p_usuarioCreacion VARCHAR(100)
)
BEGIN
    DECLARE v_operacion INT;
    DECLARE v_statusCuenta INT;
    DECLARE v_mensajeError VARCHAR(200);
    DECLARE v_fechaActual DATETIME;

    SET v_fechaActual = NOW();

    -- Validar existencia y estado de la cuenta
    SELECT IdStatusCuenta INTO v_statusCuenta
    FROM SALDO_CUENTA
    WHERE IdSaldoCuenta = p_idSaldoCuenta;

    IF v_statusCuenta IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cuenta no existe.';
    END IF;

    -- Suponiendo que el estado 1 = Activa
    IF v_statusCuenta <> 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cuenta no está activa. No se puede registrar el movimiento.';
    END IF;

    -- Validar tipo de movimiento
    SELECT OperacionCuentaCorriente INTO v_operacion
    FROM TIPO_MOVIMIENTO_CXC
    WHERE IdTipoMovimientoCXC = p_idTipoMovimientoCXC;

    IF v_operacion IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tipo de movimiento no válido.';
    END IF;

    -- Validar monto
    IF p_valorMovimiento <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El valor del movimiento debe ser mayor a cero.';
    END IF;

    -- Validar fecha
    IF p_fechaMovimiento > v_fechaActual THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La fecha del movimiento no puede ser futura.';
    END IF;

    START TRANSACTION;

        -- Actualizar saldo según el tipo de operación
        IF v_operacion = 2 THEN
            -- Sumar (crédito)
            UPDATE SALDO_CUENTA
            SET Creditos = IFNULL(Creditos,0) + p_valorMovimiento,
                FechaModificacion = v_fechaActual,
                UsuarioModificacion = p_usuarioCreacion
            WHERE IdSaldoCuenta = p_idSaldoCuenta;
        ELSEIF v_operacion = 1 THEN
            -- Restar (débito)
            UPDATE SALDO_CUENTA
            SET Debitos = IFNULL(Debitos,0) + p_valorMovimiento,
                FechaModificacion = v_fechaActual,
                UsuarioModificacion = p_usuarioCreacion
            WHERE IdSaldoCuenta = p_idSaldoCuenta;
        END IF;

        -- Registrar el movimiento
        INSERT INTO MOVIMIENTO_CUENTA (
            IdSaldoCuenta,
            IdTipoMovimientoCXC,
            FechaMovimiento,
            ValorMovimiento,
            ValorMovimientoPagado,
            GeneradoAutomaticamente,
            Descripcion,
            FechaCreacion,
            UsuarioCreacion
        ) VALUES (
            p_idSaldoCuenta,
            p_idTipoMovimientoCXC,
            p_fechaMovimiento,
            p_valorMovimiento,
            p_valorMovimiento, -- Asumimos pagado completo
            FALSE,
            p_descripcion,
            v_fechaActual,
            p_usuarioCreacion
        );

    COMMIT;
END$$

DELIMITER ;
