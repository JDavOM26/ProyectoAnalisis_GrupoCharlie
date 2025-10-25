export interface Genero {
  idGenero: number; // Cambiado de IdSucursal a IdGenero
  nombre: string;
   idUsuario?: string;
  FechaCreacion?: string; // ISO datetime
  UsuarioCreacion?: string;
  FechaModificacion?: string | null; // ISO datetime
  UsuarioModificacion?: string | null; // username
}
