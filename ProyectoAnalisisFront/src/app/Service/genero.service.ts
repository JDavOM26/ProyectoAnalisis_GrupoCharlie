
import { Genero } from './../Models/genero.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
//import { provideHttpClient } from '@angular/common/http';

// ajusta tu base URL (o usa environment)
// = 'http://localhost:8080/api/noauth/login';
const BASE= 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class GeneroService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Genero[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page != null) params = params.set('page', q.page);
    if (q?.size != null) params = params.set('size', q.size);

    return this.http.get<any>(BASE+'/generos', {
      params,
      headers: this.authHeaders(true)
    }).pipe(
          map(resp => {
            console.log('Respuesta cruda generos:', resp);
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
            console.error('Error en generos:', err);
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

create(bodyGenero: Genero): Observable<Genero> {
  const usuario = localStorage.getItem('idUsuario') || 'Sistema';

  const payload = {
    ...bodyGenero,
    idUsuario: usuario   // 👈 IMPORTANTE, el backend espera este campo
  };

  return this.http
    .post<any>(`${BASE}/crear-genero`, payload, { headers: this.authHeaders() })
    .pipe(map(this.toFront));
}

update(id: string, bodyGenero: Genero): Observable<Genero> {
  const usuario = localStorage.getItem('idUsuario') || 'Sistema';

  const payload = {
    ...bodyGenero,
    idUsuario: usuario
  };

  return this.http
    .put<any>(`${BASE}/actualizar-genero/${id}`, payload, { headers: this.authHeaders() })
    .pipe(map(this.toFront));
}


  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${BASE}/borrar-genero?idGenero=${encodeURIComponent(id)}`,
      { headers: this.authHeaders(),
      responseType: 'text' as 'json'  }
    );
  }

  getById(id: string): Observable<Genero> {
    return this.http.get<any>(
      `${BASE}/${encodeURIComponent(id)}`,
      { headers: this.authHeaders(true) }              // <= token aquí
    ).pipe(map(this.toFront));
  }

  // --- MAPEOS ---

  /** Normaliza la respuesta del backend a tu interfaz Empresa (en PascalCase). */
  private toFront = (r: any): Genero => ({
    idGenero: r.IdGenero ?? r.idGenero ?? r.id_genero ?? '',
    nombre: r.Nombre ?? r.nombre ?? r.nombre ?? ''
  });

  /** Payload en PascalCase (útil si tu API/JPA espera estos nombres exactos). */
  private toBackPascal(e: Genero): any {
    return {
      IdGenero: e.idGenero,
      Nombre: e.nombre
    };
  }
}
