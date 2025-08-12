export interface Usuario {
  idUsuario: string;
  nombre: string;
  apellido: string;
  fechaNacimiento?: string;             // ISO yyyy-MM-dd
  idStatusUsuario: number;
  password?: string;
  idGenero: number;

  ultimaFechaIngreso?: string;          // datetime ISO
  intentosDeAcceso?: number;
  sesionActual?: string;
  ultimaFechaCambioPassword?: string;

  correoElectronico?: string;
  requiereCambiarPassword?: number;     // 0/1
  fotografia?: string | null;           // base64 (o URL)
  telefonoMovil?: string;

  idSucursal: number;

  pregunta?: string;
  respuesta?: string;

  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string | null;
  usuarioModificacion?: string | null;

  // extras que mostraste (si existen en la DB):
  fechabloqueo?: string | null;
  ultimafecha_ingreso?: string | null;
}
