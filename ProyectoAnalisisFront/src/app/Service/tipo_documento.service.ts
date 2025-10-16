import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { tipo_documento } from '../Models/tipo_documento.model';


const TIPODOCUMENTO_URL= 'http://localhost:8080/api/auth/tiposDocumentos';

@Injectable({ providedIn: 'root' })
export class TipoDocumentoService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<tipo_documento[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page   != null) params = params.set('page',  q.page);
    if (q?.size   != null) params = params.set('size',  q.size);

    return this.http.get<any>(TIPODOCUMENTO_URL+'/obtener-tipos', {
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
          return this.http.get<any>(TIPODOCUMENTO_URL, {
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
        console.error('Error en obtener-tipos:', err);
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

  getById(id: string): Observable<tipo_documento> {
    return this.http.get<any>(`${TIPODOCUMENTO_URL}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(u: tipo_documento): Observable<tipo_documento> {
    u.IdUsuario = localStorage.getItem('username')?.toString();
    return this.http.post<any>(TIPODOCUMENTO_URL+'/crear-tipo', this.toBack(u),{
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }
  toFormData(u: tipo_documento) {
    throw new Error('Method not implemented.');
  }

  update(id: string, u: tipo_documento): Observable<tipo_documento> {
    u.IdUsuario = localStorage.getItem('username')?.toString();
    return this.http.put<any>(`${TIPODOCUMENTO_URL}/actualizar-tipo/${encodeURIComponent(id)}`, this.toBack(u),{
      headers: this.authHeaders()})
    .pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${TIPODOCUMENTO_URL}/borrar-tipo/${encodeURIComponent(id)}`,{
      headers: this.authHeaders(),
      responseType: 'text' as 'json'
    });
  }


  private toFront = (r: any): tipo_documento => ({
    IdTipoDocumento: r.idTipoDocumento ?? r.IdTipoDocumento,
    Nombre: r.nombre ?? r.Nombre,
    FechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    UsuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    FechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    UsuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion,
    IdUsuario: r.idUsuario ?? r.IdUsuario
  });

  private toBack(s: tipo_documento): any {
    return {
      idTipoDocumento: s.IdTipoDocumento,
      nombre: s.Nombre,
      fechaCreacion: s.FechaCreacion,
      usuarioCreacion: s.UsuarioCreacion,
      fechaModificacion:  s.FechaModificacion,
      usuarioModificacion: s.UsuarioModificacion,
      idUsuario: s.IdUsuario
    };
  }
}

