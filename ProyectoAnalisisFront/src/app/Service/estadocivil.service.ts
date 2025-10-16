import { EstadoCivil } from './../Models/estadocivil.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';


const EstadoCivil_URL= 'http://localhost:8080/api/auth/estadoCivil';

@Injectable({ providedIn: 'root' })
export class EstadoCivilService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<EstadoCivil[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page   != null) params = params.set('page',  q.page);
    if (q?.size   != null) params = params.set('size',  q.size);

    return this.http.get<any>(EstadoCivil_URL+'/obtener-estado-civil', {
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
          return this.http.get<any>(EstadoCivil_URL, {
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
        console.error('Error en obtener-estado-civil:', err);
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

  getById(id: string): Observable<EstadoCivil> {
    return this.http.get<any>(`${EstadoCivil_URL}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(u: EstadoCivil): Observable<EstadoCivil> {
    u.IdUsuario = localStorage.getItem('username')?.toString();
    return this.http.post<any>(EstadoCivil_URL+'/crear-estado-civil', this.toBack(u),{
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }
  toFormData(u: EstadoCivil) {
    throw new Error('Method not implemented.');
  }

  update(id: string, u: EstadoCivil): Observable<EstadoCivil> {
    u.IdUsuario = localStorage.getItem('username')?.toString();
    return this.http.put<any>(`${EstadoCivil_URL}/actualizar-estado-civil/${encodeURIComponent(id)}`, this.toBack(u),{
      headers: this.authHeaders()})
    .pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${EstadoCivil_URL}/borrar-estado-civil/${encodeURIComponent(id)}`,{
      headers: this.authHeaders(),
      responseType: 'text' as 'json'
    });
  }


  private toFront = (r: any): EstadoCivil => ({
IdEstadoCivil: r.IdEstadoCivil ?? r.idEstadoCivil ?? r.idEstadoCivil ?? '',
    Nombre: r.Nombre ?? r.nombre ?? '',
    FechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    UsuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    FechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    UsuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion,
    IdUsuario: r.idUsuario ?? r.IdUsuario ?? ''
  });

  private toBack(s: EstadoCivil): any {
    return {
      idEstadoCivil: s.IdEstadoCivil,
      nombre: s.Nombre,
      fechaCreacion: s.FechaCreacion,
      usuarioCreacion: s.UsuarioCreacion,
      fechaModificacion:  s.FechaModificacion,
      usuarioModificacion: s.UsuarioModificacion,
      idUsuario: s.IdUsuario
    };
  }
}

