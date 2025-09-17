export interface Sucursal {

  IdSucursal: string;
  Nombre: string;
  Direccion: string;
  IdEmpresa: string;

  FechaCreacion?: string;              // ISO datetime
  usuarioCreacion?: string;
  FechaModificacion?: string | null;   // ISO datetime
  UsuarioModificacion?: string | null; // username
}
