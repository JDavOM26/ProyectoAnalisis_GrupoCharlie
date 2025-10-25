export interface TipoMovimientoCxC {
  IdTipoMovimientoCXC: string;
  Nombre: string;
  OperacionCuentaCorriente: number;
  FechaCreacion?: string;              // ISO datetime
  UsuarioCreacion?: string;
  FechaModificacion?: string | null;   // ISO datetime
  UsuarioModificacion?: string | null; // username
  IdUsuario?: string; // usuario que realiza la operacion
}
