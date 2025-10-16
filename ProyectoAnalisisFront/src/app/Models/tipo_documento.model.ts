export interface tipo_documento {
  IdTipoDocumento: string;
  Nombre: string;
  FechaCreacion?: string;              // ISO datetime
  UsuarioCreacion?: string;
  FechaModificacion?: string | null;   // ISO datetime
  UsuarioModificacion?: string | null; // username
  IdUsuario?: string;               // for audit purposes, not mapped to backend
}
