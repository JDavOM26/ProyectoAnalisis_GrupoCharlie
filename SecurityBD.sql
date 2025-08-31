/* Etapa 1 */

DROP SCHEMA IF EXISTS `ProyectoAnalisis`;

CREATE SCHEMA IF NOT EXISTS `ProyectoAnalisis`;

USE `ProyectoAnalisis`;

CREATE TABLE `EMPRESA`(
    `IdEmpresa` INT NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `Direccion` VARCHAR(200) NOT NULL,
    `Nit` VARCHAR(20) NOT NULL,
    `PasswordCantidadMayusculas` INT,
    `PasswordCantidadMinusculas` INT,
    `PasswordCantidadCaracteresEspeciales` INT,
    `PasswordCantidadCaducidadDias` INT,
    `PasswordLargo` INT,
    `PasswordIntentosAntesDeBloquear` INT,
    `PasswordCantidadNumeros` INT,
    `PasswordCantidadPreguntasValidar` INT,
    `FechaCreacion` DATETIME NOT NULL,
    `UsuarioCreacion` VARCHAR(100) NOT NULL,
    `FechaModificacion` DATETIME,
    `UsuarioModificacion` VARCHAR(100),
    PRIMARY KEY (`IdEmpresa`)
);

INSERT INTO `EMPRESA` (
    `Nombre`, `Direccion`, `Nit`, `PasswordCantidadMayusculas`,
    `PasswordCantidadMinusculas`, `PasswordCantidadCaracteresEspeciales`,
    `PasswordCantidadCaducidadDias`, `PasswordLargo`,
    `PasswordIntentosAntesDeBloquear`, `PasswordCantidadNumeros`,
    `PasswordCantidadPreguntasValidar`, `FechaCreacion`,
    `UsuarioCreacion`, `FechaModificacion`, `UsuarioModificacion`
)
VALUES (
    'Software Inc.', 'San Jose Pinula, Guatemala', '12345678-9', 1,
    1, 1, 60, 8,
    5, 2, 1, NOW(),
    'system', NULL, NULL
);

CREATE TABLE `SUCURSAL`(
    `IdSucursal` INT NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `Direccion` VARCHAR(200) NOT NULL,
    `IdEmpresa` INT NOT NULL,
    `FechaCreacion` DATETIME NOT NULL,
    `UsuarioCreacion` VARCHAR(100) NOT NULL,
    `FechaModificacion` DATETIME,
    `UsuarioModificacion` VARCHAR(100),
    PRIMARY KEY (`IdSucursal`),
    FOREIGN KEY (`IdEmpresa`) REFERENCES `EMPRESA`(`IdEmpresa`)
);

INSERT INTO `SUCURSAL` (
    `Nombre`, `Direccion`, `IdEmpresa`, `FechaCreacion`,
    `UsuarioCreacion`, `FechaModificacion`, `UsuarioModificacion`
)
VALUES (
    'Oficinas Centrales', 'San Jose Pinula, Guatemala', 1, NOW(),
    'system', NULL, NULL
);

CREATE TABLE `STATUS_USUARIO`(
    `IdStatusUsuario` INT NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `FechaCreacion` DATETIME NOT NULL,
    `UsuarioCreacion` VARCHAR(100) NOT NULL,
    `FechaModificacion` DATETIME,
    `UsuarioModificacion` VARCHAR(100),
    PRIMARY KEY (`IdStatusUsuario`)
);

INSERT INTO `STATUS_USUARIO` (
    `Nombre`, `FechaCreacion`, `UsuarioCreacion`,
    `FechaModificacion`, `UsuarioModificacion`
)
VALUES 
('Activo', NOW(), 'system', NULL, NULL),
('Bloqueado por intentos de acceso', NOW(), 'system', NULL, NULL),
('Inactivo', NOW(), 'system', NULL, NULL);

CREATE TABLE `GENERO`(
    `IdGenero` INT NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `FechaCreacion` DATETIME NOT NULL,
    `UsuarioCreacion` VARCHAR(100) NOT NULL,
    `FechaModificacion` DATETIME,
    `UsuarioModificacion` VARCHAR(100),
    PRIMARY KEY (`IdGenero`)
);

INSERT INTO `GENERO` (
    `Nombre`, `FechaCreacion`, `UsuarioCreacion`,
    `FechaModificacion`, `UsuarioModificacion`
)
VALUES
    ('Masculino', NOW(), 'system', NULL, NULL),
    ('Femenino', NOW(), 'system', NULL, NULL);

CREATE TABLE `ROLE`(
    `IdRole` INT NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(50) NOT NULL,
    `FechaCreacion` DATETIME NOT NULL,
    `UsuarioCreacion` VARCHAR(100) NOT NULL,
    `FechaModificacion` DATETIME,
    `UsuarioModificacion` VARCHAR(100),
    PRIMARY KEY (`IdRole`)
);

INSERT INTO `ROLE` (
    `Nombre`, `FechaCreacion`, `UsuarioCreacion`,
    `FechaModificacion`, `UsuarioModificacion`
)
VALUES 
(
    'Administrador', NOW(), 'system', NULL, NULL
),
(
    'Sin Opciones', NOW(), 'system', NULL, NULL
);

CREATE TABLE `USUARIO`(
    `IdUsuario` VARCHAR(100) NOT NULL,
    `Nombre` VARCHAR(100) NOT NULL,
    `Apellido` VARCHAR(100) NOT NULL,
    `FechaNacimiento` DATE NOT NULL,
    `IdStatusUsuario` INT NOT NULL,
    `Password` VARCHAR(100) NOT NULL,
    `IdGenero` INT NOT NULL,
    `UltimaFechaIngreso` DATETIME,
    `IntentosDeAcceso` INT,
    `SesionActual` VARCHAR(100),
    `UltimaFechaCambioPassword` DATETIME,
    `CorreoElectronico` VARCHAR(100),
    `RequiereCambiarPassword` INT,
    `Fotografia` MEDIUMBLOB,
    `TelefonoMovil` VARCHAR(30),
    `IdSucursal` INT NOT NULL,
    `Pregunta` VARCHAR(200) NOT NULL,
    `Respuesta` VARCHAR(200) NOT NULL,
    `IdRole` INT NOT NULL,
    `FechaCreacion` DATETIME NOT NULL,
    `UsuarioCreacion` VARCHAR(100) NOT NULL,
    `FechaModificacion` DATETIME,
    `UsuarioModificacion` VARCHAR(100),
    PRIMARY KEY (`IdUsuario`),
    FOREIGN KEY (`IdStatusUsuario`) REFERENCES `STATUS_USUARIO`(`IdStatusUsuario`),
    FOREIGN KEY (`IdGenero`) REFERENCES `GENERO`(`IdGenero`),
    FOREIGN KEY (`IdSucursal`) REFERENCES `SUCURSAL`(`IdSucursal`),
    FOREIGN KEY (`IdRole`) REFERENCES `ROLE`(`IdRole`)
);

INSERT INTO `USUARIO` (
    `IdUsuario`, `Nombre`, `Apellido`, `FechaNacimiento`, `IdStatusUsuario`,
    `Password`, `IdGenero`, `UltimaFechaIngreso`, `IntentosDeAcceso`,
    `SesionActual`, `UltimaFechaCambioPassword`, `CorreoElectronico`,
    `RequiereCambiarPassword`, `Fotografia`, `TelefonoMovil`,
    `IdSucursal`, `FechaCreacion`, `UsuarioCreacion`,
    `FechaModificacion`, `UsuarioModificacion`, `Pregunta`, `Respuesta`, `IdRole`
)
VALUES 
(
    'system', 'Nologin', 'Nologin', '1990-05-15', 1,
    '$2a$12$7vjd0WyuwlqoqbLRYnHYEO9XYwUyceRQ8MM3edszdAF2Mczyr5Nbu', 1, NULL, 0,
    NULL, NULL, 'system@example.com',
    1, NULL, '555-1234567',
    1, NOW(), 'system', NULL, NULL, '¿Nombre de tu primera mascota?', 'Rex', 2
),
(
    'Administrador', 'Administrador', 'IT', '1990-05-15', 1,
    '$2a$12$5hk0cbX8NjF4xkJjVC8tHuJaa9ckrgajUr7aywMPF6qvcSbHsdTkC', 1, NULL, 0,
    NULL, NULL, 'itadmin@example.com',
    1, NULL, '555-1234567',
    1, NOW(), 'system', NULL, NULL, '¿Nombre de tu curso preferido?', 'Analisis de Sistemas II', 1
);

CREATE TABLE `MODULO`( 
    `IdModulo` INT NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(50) NOT NULL,
    `OrdenMenu` INT NOT NULL,
    `FechaCreacion` DATETIME NOT NULL,
    `UsuarioCreacion` VARCHAR(100) NOT NULL,
    `FechaModificacion` DATETIME,
    `UsuarioModificacion` VARCHAR(100),
    PRIMARY KEY (`IdModulo`)
);

INSERT INTO `MODULO` (
    `Nombre`, `OrdenMenu`, `FechaCreacion`, `UsuarioCreacion` 
)
VALUES
(
    'Seguridad', 1, NOW(), 'system'
);

CREATE TABLE `MENU`(
    `IdMenu` INT NOT NULL AUTO_INCREMENT,
    `IdModulo` INT NOT NULL,
    `Nombre` VARCHAR(50) NOT NULL,
    `OrdenMenu` INT NOT NULL,
    `FechaCreacion` DATETIME NOT NULL,
    `UsuarioCreacion` VARCHAR(100) NOT NULL,
    `FechaModificacion` DATETIME,
    `UsuarioModificacion` VARCHAR(100),
    PRIMARY KEY (`IdMenu`),
    FOREIGN KEY (`IdModulo`) REFERENCES `MODULO`(`IdModulo`)
);

INSERT INTO `MENU` (
    `IdModulo`, `Nombre`, `OrdenMenu`, `FechaCreacion`, `UsuarioCreacion` 
)
VALUES
(
    1, 'Parametros Generales', 1, NOW(), 'system'
),
(
    1, 'Acciones', 2, NOW(), 'system'
),
(
    1, 'Estadisticas', 3, NOW(), 'system'
),
(
    1, 'Procedimientos Almacenados', 4, NOW(), 'system'
);

CREATE TABLE `OPCION`(
    `IdOpcion` INT NOT NULL AUTO_INCREMENT,
    `IdMenu` INT NOT NULL,
    `Nombre` VARCHAR(50) NOT NULL,
    `OrdenMenu` INT NOT NULL,
    `Pagina` VARCHAR(100) NOT NULL,
    `FechaCreacion` DATETIME NOT NULL,
    `UsuarioCreacion` VARCHAR(100) NOT NULL,
    `FechaModificacion` DATETIME,
    `UsuarioModificacion` VARCHAR(100),
    PRIMARY KEY (`IdOpcion`),
    FOREIGN KEY (`IdMenu`) REFERENCES `MENU`(`IdMenu`)
);

INSERT INTO `OPCION` (
    `IdMenu`, `Nombre`, `OrdenMenu`, `Pagina`, `FechaCreacion`, `UsuarioCreacion` 
)
VALUES
(
    1, 'Empresas', 1, 'empresa.php', NOW(), 'system'  /*   idOpcion = 1   */
),
(
    1, 'Sucursales', 2, 'sucursal.php', NOW(), 'system'  /*   idOpcion = 2   */
),
(
    1, 'Generos', 3, 'genero.php', NOW(), 'system'   /*   idOpcion = 3   */
),
(
    1, 'Estatus Usuario', 4, 'status_usuario.php', NOW(), 'system'  /*   idOpcion = 4   */
),
(
    1, 'Roles', 5, 'role.php', NOW(), 'system'  /*   idOpcion = 5   */
),
(
    1, 'Modulos', 6, 'modulo.php', NOW(), 'system'   /*   idOpcion = 6   */
),
(
    1, 'Menus', 7, 'menu.php', NOW(), 'system'   /*   idOpcion = 7   */
),
(
    1, 'Opciones', 3, 'opcion.php', NOW(), 'system'   /*   idOpcion = 8   */
),
(
    2, 'Usuarios', 3, 'usuario.php', NOW(), 'system'   /*   idOpcion = 9   */
),
(
    2, 'Asignar Opciones a un Role', 3, 'asignacion_opcion_role.php', NOW(), 'system'   /*   idOpcion = 10   */
);

CREATE TABLE `ROLE_OPCION`(
    `IdRole` INT NOT NULL,
    `IdOpcion` INT NOT NULL,
    `Alta` INT NOT NULL,
    `Baja` INT NOT NULL,
    `Cambio` INT NOT NULL,
    `Imprimir` INT NOT NULL,
    `Exportar` INT NOT NULL,
    `FechaCreacion` DATETIME NOT NULL,
    `UsuarioCreacion` VARCHAR(100) NOT NULL,
    `FechaModificacion` DATETIME,
    `UsuarioModificacion` VARCHAR(100),
    PRIMARY KEY (`IdRole`,`IdOpcion`),
    FOREIGN KEY (`IdRole`) REFERENCES `ROLE`(`IdRole`),
    FOREIGN KEY (`IdOpcion`) REFERENCES `OPCION`(`IdOpcion`)
);

INSERT INTO `ROLE_OPCION` (`IdRole`, `IdOpcion`, `Alta`, `Baja`, `Cambio`, `Imprimir`, `Exportar`, `FechaCreacion`, `UsuarioCreacion`)
VALUES
(1,1,1,1,1,1,1,NOW(),'system'),
(1,2,1,1,1,1,1,NOW(),'system'),
(1,3,1,1,1,1,1,NOW(),'system'),
(1,4,1,1,1,1,1,NOW(),'system'),
(1,5,1,1,1,1,1,NOW(),'system'),
(1,6,1,1,1,1,1,NOW(),'system'),
(1,7,1,1,1,1,1,NOW(),'system'),
(1,8,1,1,1,1,1,NOW(),'system'),
(1,9,1,1,1,1,1,NOW(),'system'),
(1,10,1,1,1,1,1,NOW(),'system');

CREATE TABLE `TIPO_ACCESO`( 
    `IdTipoAcceso` INT NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `FechaCreacion` DATETIME NOT NULL,
    `UsuarioCreacion` VARCHAR(100) NOT NULL,
    `FechaModificacion` DATETIME,
    `UsuarioModificacion` VARCHAR(100),
    PRIMARY KEY (`IdTipoAcceso`)
);

INSERT INTO `TIPO_ACCESO` (
    `Nombre`, `FechaCreacion`, `UsuarioCreacion`,
    `FechaModificacion`, `UsuarioModificacion`
)
VALUES 
(
    'Acceso Concedido', NOW(), 'system', NULL, NULL
),
(
    'Bloqueado - Password incorrecto/Numero de intentos exedidos', NOW(), 'system', NULL, NULL
),
(
    'Usuario Inactivo', NOW(), 'system', NULL, NULL
),
(
    'Usuario ingresado no existe', NOW(), 'system', NULL, NULL
);

CREATE TABLE `BITACORA_ACCESO`(
    `IdBitacoraAcceso` INT NOT NULL AUTO_INCREMENT,
    `IdUsuario` VARCHAR(100) NOT NULL,
    `IdTipoAcceso` INT NOT NULL,
    `FechaAcceso` DATETIME NOT NULL,
    `HttpUserAgent` VARCHAR(200),
    `DireccionIp` VARCHAR(50),
    `Accion` VARCHAR(100), 
    `SistemaOperativo` VARCHAR(50),
    `Dispositivo` VARCHAR(50),
    `Browser` VARCHAR(50),
    `Sesion` VARCHAR(100),
    PRIMARY KEY (`IdBitacoraAcceso`),
    FOREIGN KEY (`IdTipoAcceso`) REFERENCES `TIPO_ACCESO`(`IdTipoAcceso`)
);

commit;
/* Fin etapa 1 */