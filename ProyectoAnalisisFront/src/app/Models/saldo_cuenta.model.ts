export interface SaldoCuenta {
  IdSaldoCuenta: number;
  IdPersona: number;
  IdStatusCuenta: number;
  IdTipoSaldoCuenta: number;
  SaldoAnterior: number;
  Debitos: number;
  Creditos: number;
  FechaCreacion?: string;              
  UsuarioCreacion?: string;
  FechaModificacion?: string | null;   
  UsuarioModificacion?: string | null; 
}
