export interface Rol {
  IdRole: string; // Identificador único del rol
  Nombre: string; // Nombre del rol
  IdUsuario?: string; // Usuario que realiza la operación
  FechaCreacion?: string; // Fecha de creación en formato ISO datetime
  UsuarioCreacion?: string; // Usuario que creó el rol
  FechaModificacion?: string | null; // Fecha de última modificación en formato ISO datetime
  UsuarioModificacion?: string | null; // Usuario que modificó el rol
}
