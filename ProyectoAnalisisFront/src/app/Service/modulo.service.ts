import { Modulo } from './../Models/modulo.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
//import { provideHttpClient } from '@angular/common/http';

const MODULO_URL = 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class ModuloService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Modulo[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page   != null) params = params.set('page',  q.page);
    if (q?.size   != null) params = params.set('size',  q.size);

    return this.http.get<any>(MODULO_URL+'/modulos', {
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
          return this.http.get<any>(MODULO_URL+'/modulos', {
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
    console.log('Token retrieved from localStorage:', token);
    if (!token) throw new Error('No hay token en localStorage. Inicia sesión primero.');

    let headers = new HttpHeaders({ Authorization: `Bearer ${token}`  });
    console.log('Autorizacion:', headers);
    return headers;
  }

  getById(id: string): Observable<Modulo> {
    return this.http.get<any>(`${MODULO_URL}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(u: Modulo): Observable<Modulo> {
    u.IdUsuario = localStorage.getItem('username')?.toString();
    return this.http.post<any>(`${MODULO_URL}/crear-modulo`, this.toBack(u),{
      headers: this.authHeaders()})
    .pipe(map(this.toFront));
  }
  toFormData(u: Modulo) {
    throw new Error('Method not implemented.');
  }

  update(id: string, u: Modulo): Observable<Modulo> {
    u.IdUsuario = localStorage.getItem('username')?.toString();
    return this.http.put<any>(`${MODULO_URL}/actualizar-modulo/${encodeURIComponent(id)}`, this.toBack(u),{
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${MODULO_URL}/borrar-modulo?idModulo=${encodeURIComponent(id)}`,{
      headers: this.authHeaders(),
      responseType: 'text' as 'json' 
    });
  }



  private toFront = (r: any): Modulo => ({
    IdModulo: r.idModulo ?? r.IdModulo,
    Nombre: r.nombre ?? r.Nombre,
    OrdenMenu: r.ordenMenu ?? r.OrdenMenu,
    FechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    UsuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    FechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    UsuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion,
    IdUsuario: r.idUsuario ?? r.IdUsuario
  });

  private toBack(s: Modulo): any {
    return {
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
