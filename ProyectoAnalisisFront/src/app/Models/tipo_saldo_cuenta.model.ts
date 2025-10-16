export interface TipoSaldoCuenta {
  IdTipoSaldoCuenta: string;
  Nombre: string;
  FechaCreacion?: string;              
  UsuarioCreacion?: string;
  FechaModificacion?: string | null;   
  UsuarioModificacion?: string | null; 
  IdUsuario?: string; 
}
