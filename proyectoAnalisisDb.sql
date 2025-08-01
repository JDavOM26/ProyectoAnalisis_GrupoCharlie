drop schema if exists ProyectoAnalisis;

create schema if not exists ProyectoAnalisis;

use ProyectoAnalisis;

create table EMPRESA(
	IdEmpresa int not null auto_increment,
	Nombre varchar(100) not null,
	Direccion varchar(200) not null,
	Nit varchar(20) not null,
	PasswordCantidadMayusculas int,
	PasswordCantidadMinusculas int,
	PasswordCantidadCaracteresEspeciales int,
	PasswordCantidadCaducidadDias int,
	PasswordLargo int,
	PasswordIntentosAntesDeBloquear int,
	PasswordCantidadNumeros int,
	PasswordCantidadPreguntasValidar int,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdEmpresa)
);

INSERT INTO EMPRESA (
    Nombre, Direccion, Nit, PasswordCantidadMayusculas,
    PasswordCantidadMinusculas, PasswordCantidadCaracteresEspeciales,
    PasswordCantidadCaducidadDias, PasswordLargo,
    PasswordIntentosAntesDeBloquear, PasswordCantidadNumeros,
    PasswordCantidadPreguntasValidar, FechaCreacion,
    UsuarioCreacion, FechaModificacion, UsuarioModificacion
)
VALUES (
    'Software Inc.', 'San Jose Pinula, Guatemala', '12345678-9', 1,
    1, 1, 60, 8,
    5, 2, 1, NOW(),
    'system', NULL, NULL
);

create table SUCURSAL(
	IdSucursal int not null auto_increment,
	Nombre varchar(100) not null,
	Direccion varchar(200) not null,
	IdEmpresa int not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdSucursal),
	foreign key (IdEmpresa) references EMPRESA(IdEmpresa)
);

INSERT INTO SUCURSAL (
    Nombre, Direccion, IdEmpresa, FechaCreacion,
    UsuarioCreacion, FechaModificacion, UsuarioModificacion
)
VALUES (
    'Oficinas Centrales', 'San Jose Pinula, Guatemala', 1, NOW(),
    'system', NULL, NULL
);

create table STATUS_USUARIO(
	IdStatusUsuario int not null auto_increment,
	Nombre varchar(100) not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdStatusUsuario)
);

INSERT INTO STATUS_USUARIO (
    Nombre, FechaCreacion, UsuarioCreacion,
    FechaModificacion, UsuarioModificacion
)
VALUES 
('Activo', NOW(), 'system', NULL, NULL),
('Bloqueado por intentos de acceso', NOW(), 'system', NULL, NULL),
('Inactivo', NOW(), 'system', NULL, NULL);

create table GENERO(
	IdGenero int not null auto_increment,
	Nombre varchar(100) not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdGenero)
);

INSERT INTO GENERO (
    Nombre, FechaCreacion, UsuarioCreacion,
    FechaModificacion, UsuarioModificacion
)
VALUES
    ('Masculino', NOW(), 'system', NULL, null),
    ('Femenino', NOW(), 'system', NULL, null);
   
create table USUARIO(
	IdUsuario varchar(100) not null,
	Nombre varchar(100) not null,
	Apellido varchar(100) not null,
	FechaNacimiento date not null,
	IdStatusUsuario int not null,
	Password varchar(100) not null,
	IdGenero int not null,
	UltimaFechaIngreso datetime,
	IntentosDeAcceso int,
	SesionActual varchar(100),
	UltimaFechaCambioPassword datetime,
	CorreoElectronico varchar(100),
	RequiereCambiarPassword int,
	Fotografia mediumblob,
	TelefonoMovil varchar(30),
	IdSucursal int not null,
	Pregunta varchar(200) not null,
	Respuesta varchar(200) not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdUsuario),
	foreign key (IdStatusUsuario) references STATUS_USUARIO(IdStatusUsuario),
	foreign key (IdGenero) references GENERO(IdGenero),
	foreign key (IdSucursal) references SUCURSAL(IdSucursal)
);

INSERT INTO USUARIO (
    IdUsuario, Nombre, Apellido, FechaNacimiento, IdStatusUsuario,
    Password, IdGenero, UltimaFechaIngreso, IntentosDeAcceso,
    SesionActual, UltimaFechaCambioPassword, CorreoElectronico,
    RequiereCambiarPassword, Fotografia, TelefonoMovil,
    IdSucursal, FechaCreacion, UsuarioCreacion,
    FechaModificacion, UsuarioModificacion, Pregunta, Respuesta
)
VALUES 
(
    'system', 'Nologin', 'Nologin', '1990-05-15', 1,
    MD5('erpwijoeli'), 1, NULL, 0,
    NULL, NULL, 'system@example.com',
    1, NULL, '555-1234567',
    1, NOW(), 'system', NULL, NULL, '¿Nombre de tu primera mascota?', 'Rex'
),
(
    'Administrador', 'Administrador', 'IT', '1990-05-15', 1,
    MD5('ITAdmin'), 1, NULL, 0,
    NULL, NULL, 'itadmin@example.com',
    1, NULL, '555-1234567',
    1, NOW(), 'system', NULL, NULL, '¿Nombre de tu curso preferido?', 'Analisis de Sistemas II'
);

create table ROLE(
	IdRole int not null auto_increment,
	Nombre varchar(50) not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (idRole)
);

INSERT INTO ROLE (
    Nombre, FechaCreacion, UsuarioCreacion,
    FechaModificacion, UsuarioModificacion
)
VALUES 
(
    'Administrador', NOW(), 'system', NULL, NULL
),
(
    'Sin Opciones', NOW(), 'system', NULL, NULL
);


create table USUARIO_ROLE(
	IdUsuario varchar(100) not null,
	IdRole int not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdUsuario, IdRole),
	foreign key (IdUsuario) references USUARIO(IdUsuario),
	foreign key (IdRole) references ROLE(IdRole)
);

INSERT INTO USUARIO_ROLE (
    IdUsuario, IdRole, FechaCreacion,
    UsuarioCreacion, FechaModificacion, UsuarioModificacion
)
VALUES
(
    'Administrador', 1, NOW(), 'system', NULL, NULL
),
(
    'system', 2, NOW(), 'system', NULL, NULL
);

create table MODULO( 
	IdModulo int not null auto_increment,
	Nombre varchar(50) not null,
	OrdenMenu int not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdModulo)
);

INSERT INTO MODULO (
    Nombre, OrdenMenu, FechaCreacion, UsuarioCreacion 
)
VALUES
(
    'Seguridad', 1, NOW(), 'system'
);

create table MENU(
	IdMenu int not null auto_increment,
	IdModulo int not null,
	Nombre varchar(50) not null,
	OrdenMenu int not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdMenu),
	foreign key (IdModulo) references MODULO(IdModulo)
);

INSERT INTO MENU (
    IdModulo, Nombre, OrdenMenu, FechaCreacion, UsuarioCreacion 
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

create table OPCION(
	IdOpcion int not null auto_increment,
	IdMenu int not null,
	Nombre varchar(50) not null,
	OrdenMenu int not null,
	Pagina varchar(100) not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdOpcion),
	foreign key (IdMenu) references MENU(IdMenu)
);

INSERT INTO OPCION (
    IdMenu, Nombre, OrdenMenu, Pagina, FechaCreacion, UsuarioCreacion 
)
VALUES
(
    1, 'Empresas', 1, 'empresa.php', NOW(), 'system'
),
(
    1, 'Sucursales', 2, 'sucursal.php', NOW(), 'system'
),
(
    1, 'Generos', 3, 'genero.php', NOW(), 'system'
),
(
    1, 'Estatus Usuario', 4, 'status_usuario.php', NOW(), 'system'
),
(
    1, 'Roles', 5, 'role.php', NOW(), 'system'
),
(
    1, 'Modulos', 6, 'modulo.php', NOW(), 'system'
),
(
    1, 'Menus', 7, 'menu.php', NOW(), 'system'
),
(
    1, 'Opciones', 3, 'opcion.php', NOW(), 'system'
),
(
    2, 'Usuarios', 3, 'usuario.php', NOW(), 'system'
),
(
    2, 'Asignar Roles a un Usuario', 3, 'asignacion_role_usuario.php', NOW(), 'system'
),
(
    2, 'Asignar Opciones a un Role', 3, 'asignacion_opcion_role.php', NOW(), 'system'
);

create table ROLE_OPCION(
	IdRole int not null,
	IdOpcion int not null,
	Alta int not null,
	Baja int not null,
	Cambio int not null,
	Imprimir int not null,
	Exportar int not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdRole,IdOpcion),
	foreign key (IdRole) references ROLE(IdRole),
	foreign key (IdOpcion) references OPCION(IdOpcion)
);

create table TIPO_ACCESO(
	IdTipoAcceso int not null auto_increment,
	Nombre varchar(100) not null,
	FechaCreacion datetime not null,
	UsuarioCreacion varchar(100) not null,
	FechaModificacion datetime,
	UsuarioModificacion varchar(100),
	primary key (IdTipoAcceso)
);

INSERT INTO TIPO_ACCESO (
    Nombre, FechaCreacion, UsuarioCreacion,
    FechaModificacion, UsuarioModificacion
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

create table BITACORA_ACCESO(
	IdBitacoraAcceso int not null auto_increment,
	IdUsuario varchar(100) not null,
	IdTipoAcceso int not null,
	FechaAcceso datetime not null,
	HttpUserAgent varchar(200),
	DireccionIp varchar(50),
	Accion varchar(100), 
	SistemaOperativo varchar(50),
	Dispositivo varchar(50),
	Browser varchar(50),
	Sesion varchar(100),
	primary key (IdBitacoraAcceso),
	foreign key (IdTipoAcceso) references TIPO_ACCESO(IdTipoAcceso)
);

/*Las inserciones de usuarios de la DB que dio en ingeniero encriptan la contraseña en MD5
  pero en el backend estoy encriptando con Bcrypt así que en lo que definimos esto aqui dejo unos cambios
  en las contraseñas encriptadas con Bcrypt.
*/
#Contraseña de system sin encriptar = erpwijoeli
update usuario set password = '$2a$12$QbOb4oc/4fy8r2aP8RCjeuGeYyFuwoPWMhcnT04uv7OxZ5.oTDyn2' where IdUsuario = 'system';
#Contraseña de Administrador sin encriptar = ITAdmin
update usuario set password = '$2a$12$E7ZbhqX3xMvR678wmjD1Gekq9JHW.YYysSUQrH.iTDTRgRCki3Cai' where IdUsuario = 'Administrador';

select * from usuario;
commit;

