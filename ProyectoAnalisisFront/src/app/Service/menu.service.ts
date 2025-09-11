import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Menu } from '../Models/menu.model';
import { Opcion } from '../Models/opcion.model';
//import { provideHttpClient } from '@angular/common/http';

// ajusta tu MENU_URL URL (o usa environment)
const MENU_URL = 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Menu[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page   != null) params = params.set('page',  q.page);
    if (q?.size   != null) params = params.set('size',  q.size);

    // 1) Intento con Bearer (igual que Postman)
    return this.http.get<any>(MENU_URL+'/menus', {
      params,
      headers: this.authHeaders(true)
    }).pipe(
      map(resp => {
        // DEBUG
        console.log('Respuesta cruda obtener-roles:', resp);

        // 2) Normaliza: si es array -> úsalo; si viene como { data: [...] } úsalo; si no, array vacío
        const rows = Array.isArray(resp) ? resp
                  : Array.isArray(resp?.data) ? resp.data
                  : [];

        return rows.map(this.toFront);
      }),
      // 3) Si devuelve 401 (o falla) intentamos SIN Bearer (por si ese endpoint no lo requiere)
      catchError(err => {
        if (err?.status === 401) {
          console.warn('401 con Bearer; reintentando sin Bearer…');
          return this.http.get<any>(MENU_URL, {
            params,
            headers: this.authHeaders(false)
          }).pipe(
            map(resp => {
              console.log('Respuesta cruda (sin Bearer):', resp);
              const rows = Array.isArray(resp) ? resp
                        : Array.isArray(resp?.data) ? resp.data
                        : [];
              return rows.map(this.toFront);
            })
          );
        }
        console.error('Error en obtener-roles:', err);
        return throwError(() => err);
      })
    );
  }

  private authHeaders(multipart = false): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token retrieved from localStorage:', token);
    if (!token) throw new Error('No hay token en localStorage. Inicia sesión primero.');

    let headers = new HttpHeaders({ Authorization: `Bearer ${token}`  });
    console.log('Autorizacion:', headers);
    return headers;
  }

  getById(id: string): Observable<Menu> {
    return this.http.get<any>(`${MENU_URL}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(u: Menu): Observable<Menu> {
    // Si vas a subir fotografía, usa FormData:
    //u.IdUsuario = localStorage.getItem('username')?.toString(); // TODO: cambiar por usuario logueado
    return this.http.post<any>(MENU_URL+'/crear-menu', this.toBack(u),{
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }
  toFormData(u: Menu, file: File) {
    throw new Error('Method not implemented.');
  }

  update(u: Menu): Observable<Menu> {
    //u.IdUsuario = localStorage.getItem('username')?.toString(); // TODO: cambiar por usuario logueado
    return this.http.put<any>(`${MENU_URL}/actualizar-opcion-rol`, this.toBack(u),{
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }

  delete(idRole: string,idOpcion: string): Observable<void> {
    return this.http.delete<void>(`${MENU_URL}/eliminar-opcion-rol?idRole=${encodeURIComponent(idRole)}&idOpcion=${encodeURIComponent(idOpcion)}`,{
      headers: this.authHeaders()
    });
  }



  // ---- helpers: mapeo API <-> Front ----
  private toFront = (r: any): Menu => ({
    IdMenu: r.idMenu ?? r.IdMenu,
    IdModulo: r.idModulo ?? r.IdModulo,
    Nombre: r.nombre ?? r.Nombre,
    FechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    UsuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    FechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    UsuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion,
    //IdUsuario: r.idUsuario ?? r.IdUsuario
  });

  private toBack(s: Menu): any {
    // Ajusta al naming de tu API (ej. PascalCase si usas JPA con nombres exactos)
    return {
      idMenu: s.IdMenu,
      idModulo: s.IdModulo,
      nombre: s.Nombre,
      fechaCreacion: s.FechaCreacion,
      usuarioCreacion: s.UsuarioCreacion,
      fechaModificacion:  s.FechaModificacion,
      usuarioModificacion: s.UsuarioModificacion,
      //idUsuario: s.IdUsuario
    };
  }
}
