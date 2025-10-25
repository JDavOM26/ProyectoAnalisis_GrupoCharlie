export interface RoleOpcion {
  IdRole: string; // Codigo de role
  NombreRole?: string; // Nombre del role
  IdOpcion: string; // Codigo de Opcion
  NombreOpcion?: string; // Nombre de la Opcion
  Alta: boolean; // Opcion a Agregar
  Baja: boolean; // Opcion a Eliminar
  Cambio: boolean; // Opcion a Actualizar
  Imprimir: boolean; // Opcion a Imprimir
  Exportar: boolean; // Opcion a Exportar
  IdUsuario?: string; // Usuario asociado al rol (si aplica)
  FechaCreacion?: string; // Fecha de creación en formato ISO datetime
  UsuarioCreacion?: string; // Usuario que creó el rol
  FechaModificacion?: string | null; // Fecha de última modificación en formato ISO datetime
  UsuarioModificacion?: string | null; // Usuario que modificó el rol
}
