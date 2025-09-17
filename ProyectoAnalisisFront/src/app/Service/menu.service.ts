import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Menu } from '../Models/menu.model';
import { Opcion } from '../Models/opcion.model';
//import { provideHttpClient } from '@angular/common/http';

const MENU_URL = 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Menu[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page   != null) params = params.set('page',  q.page);
    if (q?.size   != null) params = params.set('size',  q.size);

    return this.http.get<any>(MENU_URL+'/menus', {
      params,
      headers: this.authHeaders(true)
    }).pipe(
      map(resp => {

        const rows = Array.isArray(resp) ? resp
                  : Array.isArray(resp?.data) ? resp.data
                  : [];

        return rows.map(this.toFront);
      }),
      catchError(err => {
        if (err?.status === 401) {
          return this.http.get<any>(MENU_URL+'/menus', {
            params,
            headers: this.authHeaders(false)
          }).pipe(
            map(resp => {
              const rows = Array.isArray(resp) ? resp
                        : Array.isArray(resp?.data) ? resp.data
                        : [];
              return rows.map(this.toFront);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }

  private authHeaders(multipart = false): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token en localStorage. Inicia sesión primero.');

    let headers = new HttpHeaders({ Authorization: `Bearer ${token}`  });
    return headers;
  }

  create(u: Menu): Observable<Menu> {
    u.IdUsuario = localStorage.getItem('username')?.toString();
    return this.http.post<any>(MENU_URL+'/crear-menu', this.toBack(u),{
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }
  toFormData(u: Menu, file: File) {
    throw new Error('Method not implemented.');
  }

  update(id:string,u: Menu): Observable<Menu> {
    u.IdUsuario = localStorage.getItem('username')?.toString();
    return this.http.put<any>(`${MENU_URL}/actualizar-menu/${encodeURIComponent(id)}`, this.toBack(u),{
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }

  delete(idMenu: string): Observable<void> {
    return this.http.delete<void>(`${MENU_URL}/borrar-menu?idMenu=${encodeURIComponent(idMenu)}`,{
      headers: this.authHeaders(),
      responseType: 'text' as 'json'
    });
  }



  private toFront = (r: any): Menu => ({
    IdMenu: r.idMenu ?? r.IdMenu,
    IdModulo: r.idModulo ?? r.IdModulo,
    Nombre: r.nombre ?? r.Nombre,
    OrdenMenu: r.ordenMenu ?? r.OrdenMenu,
    FechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    UsuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    FechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    UsuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion,
    IdUsuario: r.idUsuario ?? r.IdUsuario
  });

  private toBack(s: Menu): any {
    return {
      idMenu: s.IdMenu,
      idModulo: s.IdModulo,
      nombre: s.Nombre,
      ordenMenu: s.OrdenMenu,
      fechaCreacion: s.FechaCreacion,
      usuarioCreacion: s.UsuarioCreacion,
      fechaModificacion:  s.FechaModificacion,
      usuarioModificacion: s.UsuarioModificacion,
      idUsuario: s.IdUsuario
    };
  }
}
