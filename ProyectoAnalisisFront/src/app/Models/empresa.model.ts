// src/app/models/empresa.model.ts
export interface Empresa {
  idEmpresa: number;
  nombre: string;
  direccion: string;
  nit: string;
  passwordCantidadMayusculas: number;
  passwordCantidadMinusculas: number;
  passwordCantidadCaracteresEspeciales: number;
  passwordCantidadCaducidadDias: number;
  passwordLargo: number;
  passwordIntentosAntesDeBloquear: number;
  passwordCantidadNumeros: number;
  passwordCantidadPreguntasValidar: number;
}
