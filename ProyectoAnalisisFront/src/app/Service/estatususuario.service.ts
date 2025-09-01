
import { EstatusUsuario } from './../Models/estatususuario.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
//import { provideHttpClient } from '@angular/common/http';


const BASE= 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class EstatususuarioService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<EstatusUsuario[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page != null) params = params.set('page', q.page);
    if (q?.size != null) params = params.set('size', q.size);

    return this.http.get<any>(BASE+'/status', {
      params,
      headers: this.authHeaders(true)
    }).pipe(
          map(resp => {
            console.log('Respuesta cruda status:', resp);
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
            console.error('Error en status:', err);
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

create(bodyGenero: EstatusUsuario): Observable<EstatusUsuario> {
  const usuario = localStorage.getItem('idUsuario') || 'Sistema';

  const payload = {
    ...bodyGenero,
    idUsuario: usuario
  };

  return this.http
    .post<any>(`${BASE}/crear-status`, payload, { headers: this.authHeaders() })
    .pipe(map(this.toFront));
}

update(id: string, bodyGenero: EstatusUsuario): Observable<EstatusUsuario> {
  const usuario = localStorage.getItem('idUsuario') || 'Sistema';

  const payload = {
    ...bodyGenero,
    idUsuario: usuario
  };

  return this.http
    .put<any>(`${BASE}/actualizar-status/${id}`, payload, { headers: this.authHeaders() })
    .pipe(map(this.toFront));
}


  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${BASE}/borrar-status?idStatus=${encodeURIComponent(id)}`,
      { headers: this.authHeaders() }
    );
  }

  getById(id: string): Observable<EstatusUsuario> {
    return this.http.get<any>(
      `${BASE}/${encodeURIComponent(id)}`,
      { headers: this.authHeaders(true) }              // <= token aquí
    ).pipe(map(this.toFront));
  }

  // --- MAPEOS ---

  private toFront = (r: any): EstatusUsuario => ({

    idStatusUsuario: r.IdStatusUsuario ?? r.idStatusUsuario ?? r.idStatus ??'',
    nombre: r.Nombre ?? r.nombre ?? r.nombre ?? ''

  });


  private toBackPascal(e: EstatusUsuario): any {
    return {
      IdStatusUsuario: e.idStatusUsuario,
      Nombre: e.nombre
    };
  }
}
