export interface Sucursal {
  IdSucursal: string;
  Nombre: string;
  Direccion: string;
  IdEmpresa: number;
  FechaCreacion?: string;              // ISO datetime
  UsuarioCreacion?: string;
  FechaModificacion?: string | null;   // ISO datetime
  UsuarioModificacion?: string | null; // username
}
