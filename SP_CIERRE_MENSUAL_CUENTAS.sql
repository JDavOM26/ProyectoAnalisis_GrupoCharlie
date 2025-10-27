DELIMITER //

CREATE PROCEDURE sp_cierre_mensual(
    IN p_usuario VARCHAR(100),
    OUT p_codigo INT
)
BEGIN
    DECLARE v_anio INT;
    DECLARE v_mes INT;
    DECLARE v_count INT DEFAULT 0;

    -- Manejador de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_codigo = 0; -- Error general
    END;

    START TRANSACTION;

    -- 1. Buscar el periodo abierto (FechaCierre IS NULL)
    SELECT Anio, Mes
    INTO v_anio, v_mes
    FROM PERIODO_CIERRE_MES
    WHERE FechaCierre IS NULL
    LIMIT 1;

    -- Validar si existe un periodo abierto
    IF v_anio IS NULL OR v_mes IS NULL THEN
        ROLLBACK;
        SET p_codigo = 2; -- No hay periodo abierto
    ELSE
        -- 2. Contar registros de SALDO_CUENTA
        SELECT COUNT(*) INTO v_count FROM SALDO_CUENTA;

        IF v_count = 0 THEN
            ROLLBACK;
            SET p_codigo = 3; -- No hay registros que consolidar
        ELSE
            -- 3. Insertar datos en SALDO_CUENTA_HIST
            INSERT INTO SALDO_CUENTA_HIST (
                Anio, Mes, IdSaldoCuenta, IdPersona, IdStatusCuenta, IdTipoSaldoCuenta,
                SaldoAnterior, Debitos, Creditos,
                FechaCreacion, UsuarioCreacion, FechaModificacion, UsuarioModificacion
            )
            SELECT
                v_anio, v_mes,
                IdSaldoCuenta, IdPersona, IdStatusCuenta, IdTipoSaldoCuenta,
                SaldoAnterior, Debitos, Creditos,
                NOW(), p_usuario, FechaModificacion, UsuarioModificacion
            FROM SALDO_CUENTA;

            -- 4. Actualizar saldos actuales (SaldoAnterior = SaldoActual)
            UPDATE SALDO_CUENTA
            SET
                SaldoAnterior = (SaldoAnterior + Creditos - Debitos),
                Debitos = 0,
                Creditos = 0,
                FechaModificacion = NOW(),
                UsuarioModificacion = p_usuario;

            -- 5. Marcar el periodo como cerrado
            UPDATE PERIODO_CIERRE_MES
            SET FechaCierre = NOW()
            WHERE Anio = v_anio AND Mes = v_mes;

            COMMIT;
            SET p_codigo = 1; -- Éxito total
        END IF;
    END IF;
END //

DELIMITER ;
