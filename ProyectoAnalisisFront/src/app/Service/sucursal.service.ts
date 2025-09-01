
/*import { Sucursal } from './../Models/sucursal.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
//import { provideHttpClient } from '@angular/common/http';

// ajusta tu base URL (o usa environment)
// = 'http://localhost:8080/api/noauth/login';
const BASE= 'http://localhost:8080/api/auth/sucursal';

@Injectable({ providedIn: 'root' })
export class SucursalService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Sucursal[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page != null) params = params.set('page', q.page);
    if (q?.size != null) params = params.set('size', q.size);

    return this.http.get<any>(BASE+'/GetSucursales', {
      params,
      headers: this.authHeaders(true)
    }).pipe(
          map(resp => {
            console.log('Respuesta cruda GetSucursales:', resp);
            const rows = Array.isArray(resp) ? resp
                      : Array.isArray(resp?.data) ? resp.data
                      : [];

            return rows.map(this.toFront);
          }),
          catchError(err => {
            if (err?.status === 401) {
              console.warn('401 con Bearer; reintentando sin Bearer…');
              return this.http.get<any>(BASE, {
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
            console.error('Error en GetSucursales:', err);
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

create(bodyGenero: Sucursal): Observable<Sucursal> {
  const usuario = localStorage.getItem('idUsuario') || 'Sistema';

  const payload = {
    ...bodyGenero,
    idUsuario: usuario   //  IMPORTANTE, el backend espera este campo
  };

  return this.http
    .post<any>(`${BASE}/CrearSucursal`, payload, { headers: this.authHeaders() })
    .pipe(map(this.toFront));
}

update(id: string, bodyGenero: Sucursal): Observable<Sucursal> {
  const usuario = localStorage.getItem('idUsuario') || 'Sistema';

  const payload = {
    ...bodyGenero,
    idUsuario: usuario
  };

  return this.http
    .put<any>(`${BASE}/ActualizarSucursal/${id}`, payload, { headers: this.authHeaders() })
    .pipe(map(this.toFront));
}


  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${BASE}/BorrarSucursal?idSucursal=${encodeURIComponent(id)}`,
      { headers: this.authHeaders() }
    );
  }

  getById(id: string): Observable<Sucursal> {
    return this.http.get<any>(
      `${BASE}/${encodeURIComponent(id)}`,
      { headers: this.authHeaders(true) }              // <= token aquí
    ).pipe(map(this.toFront));
  }

  // --- MAPEOS ---

  private toFront = (r: any): Sucursal => ({
    idSucursal: r.IdSucursal ?? r.idSucursal ?? r.idSucursal ?? '',
    Nombre: r.Nombre ?? r.nombre ?? r.nombre ?? '',
    Direccion: r.Direccion ?? r.direccion ?? r.direccion ?? '',
    idEmpresa: r.IdEmpresa ?? r.idEmpresa ?? r.idEmpresa ?? ''
  });


  private toBackPascal(e: Sucursal): any {
    return {
      IdSucursal: e.idSucursal,
      Nombre: e.Nombre,
      Direccion: e.Direccion,
      IdEmpresa: e.idEmpresa
    };
  }
}*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Sucursal } from '../Models/sucursal.model';
import { catchError, throwError } from 'rxjs';

// Ajusta la URL exactamente como expone tu API
const BASE = 'http://localhost:8080/api/auth/sucursal';

@Injectable({ providedIn: 'root' })
export class SucursalService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Sucursal[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page != null) params = params.set('page', q.page);
    if (q?.size != null) params = params.set('size', q.size);

    return this.http.get<any>(BASE+'/GetSucursales', {
      params,
      headers: this.authHeaders(true)
    }).pipe(
          map(resp => {
            console.log('Respuesta cruda GetSucursales:', resp);
            const rows = Array.isArray(resp) ? resp
                      : Array.isArray(resp?.data) ? resp.data
                      : [];

            return rows.map(this.toFront);
          }),
          catchError(err => {
            if (err?.status === 401) {
              console.warn('401 con Bearer; reintentando sin Bearer…');
              return this.http.get<any>(BASE, {
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
            console.error('Error en GetSucursales:', err);
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
   create(bodyEmpresa: Sucursal): Observable<Sucursal> {
       return this.http
         .post<any>(`${BASE}/CrearSucursal`, bodyEmpresa, { headers: this.authHeaders() })
         .pipe(map(this.toFront));
     }
    update(bodyEmpresa: Sucursal): Observable<Sucursal> {
      return this.http
      .put<any>(`${BASE}/ActualizarSucursal`,bodyEmpresa,{ headers: this.authHeaders() })
      .pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${BASE}/BorrarSucursal?idSucursal=${encodeURIComponent(id)}`,
      { headers: this.authHeaders() }
    );
  }

  getById(id: string): Observable<Sucursal> {
    return this.http.get<any>(
      `${BASE}/${encodeURIComponent(id)}`,
      { headers: this.authHeaders(true) }              // <= token aquí
    ).pipe(map(this.toFront));
  }

  // --- MAPEOS ---

  /** Normaliza la respuesta del backend a tu interfaz Empresa (en PascalCase). */
  private toFront = (r: any): Sucursal => ({
    idSucursal: r.IdSucursal ?? r.idSucursal ?? r.idSucursal ?? '',
    nombre: r.Nombre ?? r.nombre ?? r.nombre ?? '',
    direccion: r.Direccion ?? r.direccion ?? r.direccion ?? '',
    idEmpresa: r.IdEmpresa ?? r.idEmpresa ?? r.idEmpresa ?? '',
  usuarioCreacion: r.UsuarioCreacion ?? r.usuarioCreacion ?? r.usuarioCreacion ?? '',
  FechaCreacion: r.FechaCreacion ?? r.fechaCreacion ?? r.fechaCreacion ?? '',
  UsuarioModificacion: r.UsuarioModificacion ?? r.usuarioModificacion ?? r.usuarioModificacion ?? null,
  FechaModificacion: r.FechaModificacion ?? r.fechaModificacion ?? r.fechaModificacion ?? null

  });

  /** Payload en PascalCase (útil si tu API/JPA espera estos nombres exactos). */
  private toBackPascal(e: Sucursal): any {
    return {
      IdSucursal: e.idSucursal,
      Nombre: e.nombre,
      Direccion: e.direccion,
      IdEmpresa: e.idEmpresa
    };
  }
}

