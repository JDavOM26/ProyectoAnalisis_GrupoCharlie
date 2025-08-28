
import { Opcion } from './../Models/opcion.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';


// ajusta tu base URL (o usa environment)
const BASE = 'http://localhost:8080/api/noauth/login';
const USERS_LIST_URL = 'http://localhost:8080/api/auth/opcion';

@Injectable({ providedIn: 'root' })
export class OpcionService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Opcion[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page   != null) params = params.set('page',  q.page);
    if (q?.size   != null) params = params.set('size',  q.size);

    // 1) Intento con Bearer (igual que Postman)
    return this.http.get<any>(USERS_LIST_URL, {
      params,
      headers: this.authHeaders(true)
    }).pipe(
      map(resp => {
        // DEBUG
        console.log('Respuesta cruda opcion:', resp);

        // 2) Normaliza: si es array -> úsalo; si viene como { data: [...] } úsalo; si no, array vacío
        const rows = Array.isArray(resp) ? resp
                  : Array.isArray(resp?.data) ? resp.data
                  : [];

        return rows.map(this.toFront);
      }),
      // 3) Si devuelve 401 (o falla) intentamos SIN Bearer (por si ese endpoint no lo requiere)
      catchError(err => {
        if (err?.status === 401) {
          console.warn('401 con Bearer; reintentando sin Bearer…');
          return this.http.get<any>(USERS_LIST_URL, {
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
        console.error('Error en opcion:', err);
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

  getById(id: string): Observable<Opcion> {
    return this.http.get<any>(`${BASE}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(u: Opcion, file?: File): Observable<Opcion> {
    // Si vas a subir fotografía, usa FormData:
    if (file) {
      const fd = this.toFormData(u, file);
      return this.http.post<any>(BASE, fd).pipe(map(this.toFront));
    }
    return this.http.post<any>(BASE, this.toBack(u)).pipe(map(this.toFront));
  }
  toFormData(u: Opcion, file: File) {
    throw new Error('Method not implemented.');
  }

  update(id: string, u: Opcion, file?: File): Observable<Opcion> {
    if (file) {
      const fd = this.toFormData(u, file);
      return this.http.put<any>(`${BASE}/${encodeURIComponent(id)}`, fd).pipe(map(this.toFront));
    }
    return this.http.put<any>(`${BASE}/${encodeURIComponent(id)}`, this.toBack(u)).pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/${encodeURIComponent(id)}`);
  }

  // Catálogos (ajusta a tus endpoints reales, por ejemplo para empresas relacionadas)

  get() { return this.http.get<{id:number; nombre:string}[]>('http://localhost:8080/api/auth/menus'); }


  // ---- helpers: mapeo API <-> Front ----
  private toFront = (r: any): Opcion => ({
    IdOpcion: r.idOpcion ?? r.IdOpcion,
    IdMenu: r.idMenu ?? r.IdMenu,
    Nombre: r.nombre ?? r.Nombre,
    OrdenMenu: r.ordenMenu ?? r.OrdenMenu,
    Pagina: r.pagina ?? r.Pagina,
    FechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    UsuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    FechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    UsuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion
  });

  private toBack(s: Opcion): any {
    // Ajusta al naming de tu API (ej. PascalCase si usas JPA con nombres exactos)
    return {
      IdOpcion: s.IdOpcion,
      Nombre: s.Nombre,
      IdMenu: s.IdMenu,
      OrdenMenu: s.OrdenMenu,
      Pagina: s.Pagina,
      FechaCreacion: s.FechaCreacion,
      UsuarioCreacion: s.UsuarioCreacion,
      FechaModificacion:  s.FechaModificacion,
      UsuarioModificacion: s.UsuarioModificacion
    };
  }
}
