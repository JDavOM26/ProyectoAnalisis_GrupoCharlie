export interface Rol {
  idRole?: number; // Identificador único del rol
  nombre: string; // Nombre del rol
  idUsuario?: string;
  FechaCreacion?: string; // Fecha de creación en formato ISO datetime
  UsuarioCreacion?: string; // Usuario que creó el rol
  FechaModificacion?: string | null; // Fecha de última modificación en formato ISO datetime
  UsuarioModificacion?: string | null; // Usuario que modificó el rol
}
