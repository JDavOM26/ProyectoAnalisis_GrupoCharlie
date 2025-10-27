export interface statuscuentas {
  IdStatusCuenta: string;
  Nombre: string;
  FechaCreacion?: string;              // ISO datetime
  UsuarioCreacion?: string;
  FechaModificacion?: string | null;   // ISO datetime
  UsuarioModificacion?: string | null; // username
  IdUsuario?: string;
}
