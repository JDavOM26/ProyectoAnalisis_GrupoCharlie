export interface EstatusUsuario {
  IdStatusUsuario: string; // Identificador único del estatus
  Nombre: string; // Nombre del estatus
  FechaCreacion?: string; // Fecha de creación en formato ISO datetime
  UsuarioCreacion?: string; // Usuario que creó el rol
  FechaModificacion?: string | null; // Fecha de última modificación en formato ISO datetime
  UsuarioModificacion?: string | null; // Usuario que modificó el rol
  IdUsuario?: string; // Usuario asociado al estatus
}
