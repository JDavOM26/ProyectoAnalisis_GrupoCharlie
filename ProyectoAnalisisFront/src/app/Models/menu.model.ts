export interface Menu {
  IdMenu: string; // Identificador único del Menu
  IdModulo: string; // Nombre del Modulo
  Nombre?: string; // Nombre 
  OrdenMenu?: string; // Orden del Menu
  FechaCreacion?: string; // Fecha de creación en formato ISO datetime
  UsuarioCreacion?: string; // Usuario que creó el rol
  FechaModificacion?: string | null; // Fecha de última modificación en formato ISO datetime
  UsuarioModificacion?: string | null; // Usuario que modificó el rol
}
