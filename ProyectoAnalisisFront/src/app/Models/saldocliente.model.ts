// Define la estructura de los datos que se esperan en la respuesta del backend
export interface SaldoCliente {
  // Campos del SELECT en Java:
  IdSaldoCuenta?: number;
  IdPersona?: number;
  IdStatusCuenta?: number;
  IdTipoSaldoCuenta?: number;
  SaldoInicial?: number; // Mapeado de SaldoAnterior
  Cargos?: number;       // Mapeado de Debitos
  Abonos?: number;       // Mapeado de Creditos
  SaldoActual?: number;  // SaldoAnterior + Creditos - Debitos

  // Información de la persona (de la tabla JOIN persona p)
  Nombre?: string;
  Apellido?: string;
  NombreCompleto?: string;

  // Otros campos
  FechaCreacion?: string;
  UsuarioCreacion?: string;
  FechaModificacion?: string | null;
  UsuarioModificacion?: string | null;
}

// Interfaz para la solicitud (opcional, si el componente lo necesita)
export interface SaldoClienteRequest {
    valorBusqueda: string;
    tipo: string;
}
