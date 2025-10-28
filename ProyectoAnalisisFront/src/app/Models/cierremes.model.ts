export interface CierreMes {
  Anio: string; // Identificador único del estatus
  Mes: string; // Nombre del estatus
  FechaInicio?: string; // Fecha de creación en formato ISO datetime
  FechaFinal?: string; // Usuario que creó el rol
  FechaCierre?: string | null; // Fecha de última modificación en formato ISO datetime
  IdUsuario?: string; // Usuario asociado al estatus
  success: boolean;
  message: string;
}

