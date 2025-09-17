export interface MenuRow {
    IdModulo: number;
    Modulo: string;     // m.Nombre
    IdMenu: number;
    Menu: string;       // me.Nombre
    IdOpcion: number;
    Opcion: string;     // o.Nombre
    Pagina: string;     // o.Pagina (ruta/archivo)
    Alta: number | boolean;
    Baja: number | boolean;
    Cambio: number | boolean;
    Imprimir: number | boolean;
    Exportar: number | boolean;
}

export interface OptionNode {
  idOpcion: number;
  nombre: string;
  pagina: string;
  permisos: {
    Alta: boolean;
    Baja: boolean;
    Cambio: boolean;
    Imprimir: boolean;
    Exportar: boolean;
  };
}

export interface Permisos {
  Alta: boolean;
  Baja: boolean;
  Cambio: boolean;
  Imprimir: boolean;
  Exportar: boolean;
}

export interface MenuNode {
  nombre: string;
  opciones: OptionNode[];
}

export interface ModuleNode {
  nombre: string;
  menus: MenuNode[];
}

