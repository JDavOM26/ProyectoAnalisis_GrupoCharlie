export interface EstatusUsuario {
  idStatusUsuario?: number; // Identificador único del estatus
  nombre: string; // Nombre del estatus
  idUsuario?: string;
  FechaCreacion?: string; // Fecha de creación en formato ISO datetime
  UsuarioCreacion?: string; // Usuario que creó el rol
  FechaModificacion?: string | null; // Fecha de última modificación en formato ISO datetime
  UsuarioModificacion?: string | null; // Usuario que modificó el rol
  IdUsuario?: string; // Usuario asociado al estatus
}
