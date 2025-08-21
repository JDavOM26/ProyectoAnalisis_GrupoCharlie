export interface Genero {
  IdGenero: string; // Cambiado de IdSucursal a IdGenero
  Nombre: string;
  Descripcion?: string; // Agregado para descripción del género
  FechaCreacion?: string; // ISO datetime
  UsuarioCreacion?: string;
  FechaModificacion?: string | null; // ISO datetime
  UsuarioModificacion?: string | null; // username
}
