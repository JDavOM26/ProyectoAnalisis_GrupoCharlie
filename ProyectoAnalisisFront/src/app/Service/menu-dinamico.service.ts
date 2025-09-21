import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map, Observable } from 'rxjs';
import {
  MenuRow,
  ModuleNode,
  MenuNode,
  OptionNode,
  Permisos
} from '../Models/menu.perm.model';

const BASE = 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class MenuDinamicoService {
  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  
  private toBool(v: unknown): boolean {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number')  return v !== 0;
    if (typeof v === 'string')  return v.trim().toLowerCase() === '1' || v.trim().toLowerCase() === 'true';
    return false;
  }

  
  private normalizeStem(p: string | null | undefined): string {
    return (p || '').replace(/\.html$/i, '').trim().toLowerCase();
  }

  private readonly stemToRouteKey: Record<string, string> = {
    empresa: 'empresas',
    sucursal: 'sucursales',
    genero: 'generos',
    'estatususuario': 'estatus-usuario',
    rol: 'roles',
    modulo: 'modulos',
    menu: 'menus',
    usuario: 'usuarios',
    opcion: 'opciones',
    'role-opcion': 'role-opcion'
  };

  
  private routeKeyFromPagina(pagina: string | null | undefined): string {
    const stem = this.normalizeStem(pagina);
    return this.stemToRouteKey[stem] ?? stem;
  }

  private getModuloNombre(r: any): string {
    return (r.Modulo ?? r.modulo ?? 'Sin módulo').toString().trim();
  }

  private getMenuNombre(r: any): string {
    return (r.Menu ?? r.menu ?? 'Sin menú').toString().trim();
  }

  private rowToOption(r: MenuRow): OptionNode {
    return {
      idOpcion: r.IdOpcion,
      nombre:   r.Opcion,
      pagina:   r.Pagina,
      permisos: {
        Alta:      this.toBool(r.Alta),
        Baja:      this.toBool(r.Baja),
        Cambio:    this.toBool(r.Cambio),
        Imprimir:  this.toBool(r.Imprimir),
        Exportar:  this.toBool(r.Exportar),
      }
    };
  }

  getMenuRows(): Observable<MenuRow[]> {
    const user = localStorage.getItem('username');
    return this.http.get<any[]>(`${BASE}/opciones?idUsuario=${user}`, {
      headers: this.authHeaders()
    }).pipe(
      tap(resp => console.log('[opciones] respuesta cruda:', resp)),
      map(rows => (rows ?? []).map(r => ({
        IdModulo : r.IdModulo ?? r.idModulo,
        Modulo   : r.Modulo   ?? r.modulo,
        IdMenu   : r.IdMenu   ?? r.idMenu,
        Menu     : r.Menu     ?? r.menu,
        IdOpcion : r.IdOpcion ?? r.idOpcion,
        Opcion   : r.Opcion   ?? r.opcion,
        Pagina   : r.Pagina   ?? r.pagina,
        Alta     : r.Alta,
        Baja     : r.Baja,
        Cambio   : r.Cambio,
        Imprimir : r.Imprimir,
        Exportar : r.Exportar,
      }) as MenuRow)),
      tap(rows => console.log('[opciones] normalizado:', rows))
    );
  }

  getMenuTree(): Observable<ModuleNode[]> {
    return this.getMenuRows().pipe(
      map(rows => {
        const moduloMap = new Map<string, ModuleNode>();

        for (const r of rows as any[]) {
          const moduloNombre = this.getModuloNombre(r);
          const menuNombre   = this.getMenuNombre(r);

          if (!moduloMap.has(moduloNombre)) {
            moduloMap.set(moduloNombre, { nombre: moduloNombre, menus: [] });
          }
          const modulo = moduloMap.get(moduloNombre)!;

          let menu: MenuNode | undefined = modulo.menus.find(m => m.nombre === menuNombre);
          if (!menu) {
            menu = { nombre: menuNombre, opciones: [] };
            modulo.menus.push(menu);
          }

          menu!.opciones.push(this.rowToOption(r));
        }

        const modules = Array.from(moduloMap.values())
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
        modules.forEach(m => m.menus.sort((a, b) => a.nombre.localeCompare(b.nombre)));

        return modules;
      })
    );
  }

  getPermisosMap(): Observable<Record<string, Permisos>> {
    return this.getMenuRows().pipe(
      map(rows => {
        const mapa: Record<string, Permisos> = {};

        for (const r of rows) {
          const key = this.routeKeyFromPagina(r.Pagina); 
          if (!key) continue;

          const next: Permisos = {
            Alta:      this.toBool(r.Alta),
            Baja:      this.toBool(r.Baja),
            Cambio:    this.toBool(r.Cambio),
            Imprimir:  this.toBool(r.Imprimir),
            Exportar:  this.toBool(r.Exportar),
          };

          
          const prev = mapa[key];
          mapa[key] = prev
            ? {
                Alta:      prev.Alta      || next.Alta,
                Baja:      prev.Baja      || next.Baja,
                Cambio:    prev.Cambio    || next.Cambio,
                Imprimir:  prev.Imprimir  || next.Imprimir,
                Exportar:  prev.Exportar  || next.Exportar,
              }
            : next;
        }
        localStorage.setItem('permisosMap', JSON.stringify(mapa));
        return mapa;
      }),
      tap(m => console.log('[permisos] mapa:', m))
    );
  }

  getPermisos(pageKey: string): Observable<Permisos> {
    const key = (pageKey || '').trim().toLowerCase();           
    const stem = this.normalizeStem(pageKey);                    
    return this.getPermisosMap().pipe(
      map(mapa =>
        mapa[key] ??
        mapa[this.stemToRouteKey[stem] ?? stem] ?? 
        {
          Alta: false, Baja: false, Cambio: false, Imprimir: false, Exportar: false
        }
      ),
      tap(p => console.log(`[permisos] para "${pageKey}":`, p))
    );
  }

  getPermisosFromLocal(pageKey: string): Permisos {
  const key = (pageKey || '').trim().toLowerCase();
  const mapaStr = localStorage.getItem('permisosMap');
  if (!mapaStr) {
    return { Alta:false, Baja:false, Cambio:false, Imprimir:false, Exportar:false };
  }
  const mapa: Record<string, Permisos> = JSON.parse(mapaStr);
  return mapa[key] ?? { Alta:false, Baja:false, Cambio:false, Imprimir:false, Exportar:false };
}
}
