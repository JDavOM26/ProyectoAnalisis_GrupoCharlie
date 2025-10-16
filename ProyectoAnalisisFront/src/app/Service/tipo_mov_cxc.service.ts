import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TipoMovimientoCxC } from '../Models/tipo_movimiento_cxc.model';
//import { provideHttpClient } from '@angular/common/http';

const TIPOMOVCXC_URL = 'http://localhost:8080/api/auth/tiposMovCC';

@Injectable({ providedIn: 'root' })
export class TipoMovimientoCxCService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<TipoMovimientoCxC[]> {
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

  getById(id: string): Observable<TipoMovimientoCxC> {
    return this.http.get<any>(`${TIPOMOVCXC_URL}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(u: TipoMovimientoCxC): Observable<TipoMovimientoCxC> {
    u.IdUsuario = localStorage.getItem('username')?.toString();
    return this.http.post<any>(TIPOMOVCXC_URL+'/crear-tipo', this.toBack(u),{
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }
  toFormData(u: TipoMovimientoCxC) {
    throw new Error('Method not implemented.');
  }

  update(id: string, u: TipoMovimientoCxC): Observable<TipoMovimientoCxC> {
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


  private toFront = (r: any): TipoMovimientoCxC => ({
    IdTipoMovimientoCXC: r.idTipoMovimientoCXC ?? r.IdTipoMovimientoCXC,
    Nombre: r.nombre ?? r.Nombre,
    OperacionCuentaCorriente: r.operacionCuentaCorriente ?? r.OperacionCuentaCorriente,
    FechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    UsuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    FechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    UsuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion,
    IdUsuario: r.idUsuario ?? r.IdUsuario
  });

  private toBack(s: TipoMovimientoCxC): any {
    return {
      idTipoMovimientoCXC: s.IdTipoMovimientoCXC,
      nombre: s.Nombre,
      operacionCuentaCorriente: s.OperacionCuentaCorriente,
      fechaCreacion: s.FechaCreacion,
      usuarioCreacion: s.UsuarioCreacion,
      fechaModificacion:  s.FechaModificacion,
      usuarioModificacion: s.UsuarioModificacion,
      idUsuario: s.IdUsuario
    };
  }
}

