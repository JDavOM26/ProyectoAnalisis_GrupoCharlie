
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { EstatusUsuario } from '../Models/estatususuario.model';

const BASE = 'http://localhost:8080/api/auth';


@Injectable({ providedIn: 'root' })
export class EstatusUsuarioService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<EstatusUsuario[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page != null) params = params.set('page', q.page);
    if (q?.size != null) params = params.set('size', q.size);


    return this.http.get<any>(BASE + '/status', {
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
          return this.http.get<any>(BASE+'/status', {
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


  create(u: EstatusUsuario): Observable<EstatusUsuario> {
    u.IdUsuario = localStorage.getItem('username') || 'Sistema';
  
    return this.http
    .post<any>(BASE+'/crear-status', this.toBack(u), { headers: this.authHeaders() })
    .pipe(map(this.toFront));
  }

  update(id: string, u: EstatusUsuario): Observable<EstatusUsuario> {
    u.IdUsuario = localStorage.getItem('username') || 'Sistema';
    return this.http.put<any>(`${BASE}/actualizar-status/${encodeURIComponent(id)}`, 
    this.toBack(u),{ headers: this.authHeaders() })
    .pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/borrar-status?idStatus=${encodeURIComponent(id)}`,{
      headers: this.authHeaders(),
      responseType: 'text' as 'json'
    });
  }

  private toFront = (r: any): EstatusUsuario => ({
    IdStatusUsuario: r.idStatusUsuario ?? r.IdStatusUsuario,
    Nombre: r.nombre ?? r.Nombre,
    FechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    UsuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    FechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    UsuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion,
    IdUsuario: r.idUsuario ?? r.IdUsuario
  });

  private toBack(s: EstatusUsuario): any {
    
    return {
      idStatusUsuario: s.IdStatusUsuario,
      nombre: s.Nombre,
      fechaCreacion: s.FechaCreacion,
      usuarioCreacion: s.UsuarioCreacion,
      fechaModificacion:  s.FechaModificacion,
      usuarioModificacion: s.UsuarioModificacion,
      idUsuario: s.IdUsuario

    };
  }
}
