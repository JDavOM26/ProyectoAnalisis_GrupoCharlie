
import { Opcion } from './../Models/opcion.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';


const BASE = 'http://localhost:8080/api/noauth/login';
const OPC_URL = 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class OpcionService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Opcion[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page   != null) params = params.set('page',  q.page);
    if (q?.size   != null) params = params.set('size',  q.size);

    return this.http.get<any>(OPC_URL+'/opcion', {
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
          return this.http.get<any>(OPC_URL+'/opcion', {
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
        console.error('Error en opcion:', err);
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

  getById(id: string): Observable<Opcion> {
    return this.http.get<any>(`${BASE}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(u: Opcion): Observable<Opcion> {
    u.IdUsuario = localStorage.getItem('username')?.toString();
    return this.http.post<any>(`${OPC_URL}/crear-opcion`, this.toBack(u),{
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }
  toFormData(u: Opcion) {
    throw new Error('Method not implemented.');
  }

  update(id: string, u: Opcion): Observable<Opcion> {
    u.IdUsuario = localStorage.getItem('username')?.toString();
    return this.http.put<any>(`${OPC_URL}/actualizar-opcion/${encodeURIComponent(id)}`, this.toBack(u),{
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${OPC_URL}/borrar-opcion?idOpcion=${encodeURIComponent(id)}`,{
      headers: this.authHeaders(),
      responseType: 'text' as 'json'
    });
  }

  private toFront = (r: any): Opcion => ({
    IdOpcion: r.idOpcion ?? r.IdOpcion,
    IdMenu: r.idMenu ?? r.IdMenu,
    Nombre: r.nombre ?? r.Nombre,
    OrdenMenu: r.ordenMenu ?? r.OrdenMenu,
    Pagina: r.pagina ?? r.Pagina,
    FechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    UsuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    FechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    UsuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion,
    IdUsuario: r.idUsuario ?? r.IdUsuario
  });

  private toBack(s: Opcion): any {
    return {
      idOpcion: s.IdOpcion,
      nombre: s.Nombre,
      idMenu: s.IdMenu,
      ordenMenu: s.OrdenMenu,
      pagina: s.Pagina,
      fechaCreacion: s.FechaCreacion,
      usuarioCreacion: s.UsuarioCreacion,
      fechaModificacion:  s.FechaModificacion,
      usuarioModificacion: s.UsuarioModificacion,
      idUsuario: s.IdUsuario
    };
  }
}
