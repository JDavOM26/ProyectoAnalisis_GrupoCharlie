import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Sucursal } from '../Models/sucursal.model';
//import { provideHttpClient } from '@angular/common/http';

const SUCURSAL_URL = 'http://localhost:8080/api/auth/sucursal';

@Injectable({ providedIn: 'root' })
export class SucursalService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Sucursal[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page   != null) params = params.set('page',  q.page);
    if (q?.size   != null) params = params.set('size',  q.size);

    return this.http.get<any>(SUCURSAL_URL+'/GetSucursales', {
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
          return this.http.get<any>(SUCURSAL_URL, {
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

  getById(id: string): Observable<Sucursal> {
    return this.http.get<any>(`${SUCURSAL_URL}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(u: Sucursal): Observable<Sucursal> {
    return this.http.post<any>(SUCURSAL_URL+'/CrearSucursal', this.toBack(u),{
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }
  toFormData(u: Sucursal) {
    throw new Error('Method not implemented.');
  }

  update(id: string, u: Sucursal): Observable<Sucursal> {
    return this.http.put<any>(`${SUCURSAL_URL}/ActualizarSucursal`, this.toBack(u),{
      headers: this.authHeaders()})
    .pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${SUCURSAL_URL}/BorrarSucursal?idSucursal=${encodeURIComponent(id)}`,{
      headers: this.authHeaders(),
      responseType: 'text' as 'json' 
    });
  }


  private toFront = (r: any): Sucursal => ({
    IdSucursal: r.idSucursal ?? r.IdSucursal,
    Nombre: r.nombre ?? r.Nombre,
    Direccion: r.direccion ?? r.Direccion,
    IdEmpresa: r.idEmpresa ?? r.IdEmpresa,
    FechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    UsuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    FechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    UsuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion
  });

  private toBack(s: Sucursal): any {
    return {
      idSucursal: s.IdSucursal,
      nombre: s.Nombre,
      direccion: s.Direccion,
      idEmpresa: s.IdEmpresa,
      fechaCreacion: s.FechaCreacion,
      usuarioCreacion: s.UsuarioCreacion,
      fechaModificacion:  s.FechaModificacion,
      usuarioModificacion: s.UsuarioModificacion
    };
  }
}

