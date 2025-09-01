export interface Sucursal {
  idSucursal: string;
  nombre: string;
  direccion: string;
  idEmpresa: number;
  //idUsuario?: string;
  FechaCreacion?: string;              // ISO datetime
  usuarioCreacion?: string;
  FechaModificacion?: string | null;   // ISO datetime
  UsuarioModificacion?: string | null; // username
}
