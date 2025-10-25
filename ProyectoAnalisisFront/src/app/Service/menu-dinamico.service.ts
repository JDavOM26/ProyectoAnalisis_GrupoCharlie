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

  // ------------------------
  // AUTORIZACIÓN
  // ------------------------
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ------------------------
  // UTILIDADES
  // ------------------------
  private toBool(v: unknown): boolean {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') return v.trim().toLowerCase() === '1' || v.trim().toLowerCase() === 'true';
    return false;
  }

  private normalizeStem(p: string | null | undefined): string {
    return (p || '').replace(/\.html$/i, '').trim().toLowerCase();
  }

  private readonly stemToRouteKey: Record<string, string> = {
    'empresa': 'empresas',
    'sucursal': 'sucursales',
    'genero': 'generos',
    'estatususuario': 'estatus-usuario',
    'rol': 'roles',
    'modulo': 'modulos',
    'menu': 'menus',
    'usuario': 'usuarios',
    'opcion': 'opciones',
    'role-opcion': 'role-opcion',
    'persona': 'personas'
  };

  private routeKeyFromPagina(pagina: string | null | undefined): string {
    const stem = this.normalizeStem(pagina);
    return this.stemToRouteKey[stem] ?? stem;
  }

  private getModuloNombre(r: any): string {
    return (r.Modulo ?? r.modulo ?? 'Sin modulo').toString().trim();
  }

  private getMenuNombre(r: any): string {
    return (r.Menu ?? r.menu ?? 'Sin menu').toString().trim();
  }

  // ------------------------
  // CONVERSIÓN DE FILAS
  // ------------------------
  private rowToOption(r: any): OptionNode {
    return {
      idOpcion: r.IdOpcion ?? r.idOpcion,
      nombre:   r.Opcion   ?? r.opcion,
      pagina:   r.Pagina   ?? r.pagina,
      permisos: {
        Alta:      this.toBool(r.Alta      ?? r.alta),
        Baja:      this.toBool(r.Baja      ?? r.baja),
        Cambio:    this.toBool(r.Cambio    ?? r.cambio),
        Imprimir:  this.toBool(r.Imprimir  ?? r.imprimir),
        Exportar:  this.toBool(r.Exportar  ?? r.exportar),
      }
    };
  }

  // ------------------------
  // OBTENER OPCIONES CRUD
  // ------------------------
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
        Alta     : r.Alta     ?? r.alta,
        Baja     : r.Baja     ?? r.baja,
        Cambio   : r.Cambio   ?? r.cambio,
        Imprimir : r.Imprimir ?? r.imprimir,
        Exportar : r.Exportar ?? r.exportar
      }) as MenuRow)),
      tap(rows => console.log('[opciones] normalizado:', rows))
    );
  }

  // ------------------------
  // CONSTRUIR MENÚ COMPLETO
  // ------------------------
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

          menu.opciones.push(this.rowToOption(r));
        }

        const modules = Array.from(moduloMap.values())
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
        modules.forEach(m => m.menus.sort((a, b) => a.nombre.localeCompare(b.nombre)));

        return modules;
      })
    );
  }

  // ------------------------
  // MAPA DE PERMISOS
  // ------------------------
  getPermisosMap(): Observable<Record<string, Permisos>> {
    return this.getMenuRows().pipe(
      map(rows => {
        const mapa: Record<string, Permisos> = {};

        for (const r of rows as any[]) {
          const key = this.routeKeyFromPagina(r.Pagina ?? r.pagina);
          if (!key) continue;

          const next: Permisos = {
            Alta:      this.toBool(r.Alta      ?? r.alta),
            Baja:      this.toBool(r.Baja      ?? r.baja),
            Cambio:    this.toBool(r.Cambio    ?? r.cambio),
            Imprimir:  this.toBool(r.Imprimir  ?? r.imprimir),
            Exportar:  this.toBool(r.Exportar  ?? r.exportar),
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

        // Guardar permisos en localStorage
        localStorage.setItem('permisosMap', JSON.stringify(mapa));
        return mapa;
      }),
      tap(m => console.log('[permisos] mapa:', m))
    );
  }

  // ------------------------
  // PERMISOS DESDE LOCALSTORAGE
  // ------------------------
  getPermisosFromLocal(pageKey: string): Permisos {
    const key = (pageKey || '').trim().toLowerCase();
    const mapaStr = localStorage.getItem('permisosMap');
    if (!mapaStr) {
      return { Alta: false, Baja: false, Cambio: false, Imprimir: false, Exportar: false };
    }
    const mapa: Record<string, Permisos> = JSON.parse(mapaStr);
    return mapa[key] ?? { Alta: false, Baja: false, Cambio: false, Imprimir: false, Exportar: false };
  }

  // ------------------------
  // PERMISOS DIRECTOS (CON BACKEND)
  // ------------------------
  getPermisos(pageKey: string): Observable<Permisos> {
    const key = this.normalizeStem(pageKey);
    return this.getPermisosMap().pipe(
      map(mapa =>
        mapa[key] ??
        mapa[this.stemToRouteKey[key]] ??
        { Alta: false, Baja: false, Cambio: false, Imprimir: false, Exportar: false }
      ),
      tap(p => console.log(`[permisos] para "${pageKey}":`, p))
    );
  }
}
