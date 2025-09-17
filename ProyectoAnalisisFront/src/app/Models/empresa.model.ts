// src/app/models/empresa.model.ts
export interface Empresa {
  IdEmpresa: string;
  Nombre: string;
  Direccion: string;
  Nit: string;
  PasswordCantidadMayusculas: number;
  PasswordCantidadMinusculas: number;
  PasswordCantidadCaracteresEspeciales: number;
  PasswordCantidadCaducidadDias: number;
  PasswordLargo: number;
  PasswordIntentosAntesDeBloquear: number;
  PasswordCantidadNumeros: number;
  PasswordCantidadPreguntasValidar: number;
}
