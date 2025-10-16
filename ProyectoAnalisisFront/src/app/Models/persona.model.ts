export interface Persona {
  IdPersona: number;
  Nombre: string;
  Apellido: string;
  FechaNacimiento: string;
  IdGenero: number;
  Direccion: string;
  Telefono: string;
  CorreoElectronico: string;
  IdEstadoCivil: string;
  FechaCreacion?: string;              
  UsuarioCreacion?: string;
  FechaModificacion?: string | null;   
  UsuarioModificacion?: string | null; 
}
