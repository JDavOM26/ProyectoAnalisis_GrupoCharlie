import { statuscuentas } from '../Models/statusdecuentas.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';


const STATUSDECUENTAS_URL= 'http://localhost:8080/api/auth/statusCuentas';

@Injectable({ providedIn: 'root' })
export class StatusdecuentasService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<statuscuentas[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page   != null) params = params.set('page',  q.page);
    if (q?.size   != null) params = params.set('size',  q.size);

    return this.http.get<any>(STATUSDECUENTAS_URL+'/obtener-status', {
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
          return this.http.get<any>(STATUSDECUENTAS_URL, {
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
        console.error('Error en obtener-status:', err);
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

  getById(id: string): Observable<statuscuentas> {
    return this.http.get<any>(`${STATUSDECUENTAS_URL}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(u: statuscuentas): Observable<statuscuentas> {
    u.IdUsuario = localStorage.getItem('username') || '';
    u.UsuarioCreacion = localStorage.getItem('username') || 'Sistema';
    return this.http.post<any>(STATUSDECUENTAS_URL+'/crear-status', this.toBack(u),{
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }
  toFormData(u: statuscuentas) {
    throw new Error('Method not implemented.');
  }

  update(id: string, u: statuscuentas): Observable<statuscuentas> {
    u.IdUsuario = localStorage.getItem('username') || 'Sistema';
    return this.http.put<any>(`${STATUSDECUENTAS_URL}/actualizar-status/${encodeURIComponent(id)}`, this.toBack(u),{
      headers: this.authHeaders()})
    .pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${STATUSDECUENTAS_URL}/borrar-status/${encodeURIComponent(id)}`,{
      headers: this.authHeaders(),
      responseType: 'text' as 'json'
    });
  }


  private toFront = (r: any): statuscuentas => ({
    IdStatusCuenta: r.IdStatusCuenta ?? r.idStatusCuenta ?? '',
    Nombre: r.Nombre ?? r.nombre ?? '',
    FechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    UsuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    FechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    UsuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion,
    IdUsuario: r.idUsuario ?? r.IdUsuario
  });

  private toBack(s: statuscuentas): any {
    return {
      idStatusCuenta: s.IdStatusCuenta,
      nombre: s.Nombre,
      fechaCreacion: s.FechaCreacion,
      usuarioCreacion: s.UsuarioCreacion,
      fechaModificacion:  s.FechaModificacion,
      usuarioModificacion: s.UsuarioModificacion,
      idUsuario: s.IdUsuario
    };
  }
}

