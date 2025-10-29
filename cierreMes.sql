DELIMITER //

CREATE PROCEDURE sp_cierre_mensual(
    IN p_usuario VARCHAR(100),
    OUT p_codigo INT
)
BEGIN
    DECLARE v_anio INT DEFAULT NULL;
    DECLARE v_mes INT DEFAULT NULL;
    DECLARE v_count INT DEFAULT 0;

    -- Manejo de errores generales
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_codigo = 0;
    END;

    -- Asumir éxito
    SET p_codigo = 1;

    START TRANSACTION;

    -- 1. Obtener periodo abierto
    SELECT Anio, Mes
    INTO v_anio, v_mes
    FROM PERIODO_CIERRE_MES
    WHERE FechaCierre IS NULL
    LIMIT 1;

    -- Validación 1: ¿Existe periodo?
     
   IF EXISTS (
    SELECT 1 
      FROM PERIODO_CIERRE_MES 
     WHERE Anio = 2025 
       AND Mes = 10 
       AND FechaCierre IS NOT NULL
   )   THEN
        ROLLBACK;
        SET p_codigo = 2;  -- No hay periodo abierto
    ELSEIF v_anio <> YEAR(CURDATE()) OR v_mes <> MONTH(CURDATE()) THEN
        ROLLBACK;
        SET p_codigo = 4;  -- Año/mes no coincide con actual
    ELSE
        -- 2. Contar saldos
        SELECT COUNT(*) INTO v_count FROM SALDO_CUENTA;

        IF v_count = 0 THEN
            ROLLBACK;
            SET p_codigo = 3;  -- No hay datos para consolidar
        ELSE
            -- 3. Insertar en histórico
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

            -- 4. Reiniciar saldos actuales
            UPDATE SALDO_CUENTA
            SET
                SaldoAnterior = SaldoAnterior + Creditos - Debitos,
                Debitos = 0,
                Creditos = 0,
                FechaModificacion = NOW(),
                UsuarioModificacion = p_usuario;

            -- 5. Cerrar periodo
            UPDATE PERIODO_CIERRE_MES
            SET FechaCierre = NOW()
            WHERE Anio = v_anio AND Mes = v_mes;

            -- 6. Confirmar
            COMMIT;
            SET p_codigo = 1;  -- Éxito
        END IF;
    END IF;

END;
//

DELIMITER ;




select * from periodo_cierre_mes;