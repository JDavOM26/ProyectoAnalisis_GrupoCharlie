export interface Opcion {
  IdOpcion: string; // Identificador único de la opción
  IdMenu: string; // Identificador único de la opción
  Nombre: string; // Nombre de la opción
  OrdenMenu: number; // Orden de la opción en el menú
  Pagina: string; // Página asociada a la opción
  IdUsuario?: string; // Usuario asociado a la opción (opcional)
  FechaCreacion?: string; // Fecha de creación en formato ISO datetime
  UsuarioCreacion?: string; // Usuario que creó la opción
  FechaModificacion?: string | null; // Fecha de última modificación en formato ISO datetime
  UsuarioModificacion?: string | null; // Usuario que modificó la opción
}
