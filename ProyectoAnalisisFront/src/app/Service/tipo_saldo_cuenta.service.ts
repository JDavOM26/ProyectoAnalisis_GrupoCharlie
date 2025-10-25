import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TipoSaldoCuenta } from '../Models/tipo_saldo_cuenta.model';
//import { provideHttpClient } from '@angular/common/http';

const TIPOMOVCXC_URL = 'http://localhost:8080/api/auth/tiposCuentas';

@Injectable({ providedIn: 'root' })
export class TipoSaldoCuentaService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<TipoSaldoCuenta[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page   != null) params = params.set('page',  q.page);
    if (q?.size   != null) params = params.set('size',  q.size);

    return this.http.get<any>(TIPOMOVCXC_URL+'/obtener-tipos', {
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
          return this.http.get<any>(TIPOMOVCXC_URL, {
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
        console.error('Error en getAllUsers:', err);
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

  getById(id: string): Observable<TipoSaldoCuenta> {
    return this.http.get<any>(`${TIPOMOVCXC_URL}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(u: TipoSaldoCuenta): Observable<TipoSaldoCuenta> {
    u.IdUsuario = localStorage.getItem('username')?.toString();
    return this.http.post<any>(TIPOMOVCXC_URL+'/crear-tipo', this.toBack(u),{
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }
  toFormData(u: TipoSaldoCuenta) {
    throw new Error('Method not implemented.');
  }

  update(id: string, u: TipoSaldoCuenta): Observable<TipoSaldoCuenta> {
    u.IdUsuario = localStorage.getItem('username')?.toString();
    return this.http.put<any>(`${TIPOMOVCXC_URL}/actualizar-tipo/${encodeURIComponent(id)}`, this.toBack(u),{
      headers: this.authHeaders()})
    .pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${TIPOMOVCXC_URL}/borrar-tipo/${encodeURIComponent(id)}`,{
      headers: this.authHeaders(),
      responseType: 'text' as 'json' 
    });
  }


  private toFront = (r: any): TipoSaldoCuenta => ({
    IdTipoSaldoCuenta: r.idTipoSaldoCuenta ?? r.IdTipoSaldoCuenta,
    Nombre: r.nombre ?? r.Nombre,
    FechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    UsuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    FechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    UsuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion,
    IdUsuario: r.idUsuario ?? r.IdUsuario
  });

  private toBack(s: TipoSaldoCuenta): any {
    return {
      idTipoSaldoCuenta: s.IdTipoSaldoCuenta,
      nombre: s.Nombre,
      fechaCreacion: s.FechaCreacion,
      usuarioCreacion: s.UsuarioCreacion,
      fechaModificacion:  s.FechaModificacion,
      usuarioModificacion: s.UsuarioModificacion,
      idUsuario: s.IdUsuario
    };
  }
}

