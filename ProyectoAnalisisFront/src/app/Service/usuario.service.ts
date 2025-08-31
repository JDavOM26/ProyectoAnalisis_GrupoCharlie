import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Usuario } from '../Models/usuario.model';

const LOGIN_URL     = 'http://localhost:8080/api/noauth/login';
const USERS_BASE    = 'http://localhost:8080/api/auth';
const USERS_LIST_URL= 'http://localhost:8080/api/auth/getAllUsers';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Usuario[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page   != null) params = params.set('page',  String(q.page));
    if (q?.size   != null) params = params.set('size',  String(q.size));

    return this.http.get<any>(USERS_LIST_URL, {
      params,
      headers: this.authHeaders()
    }).pipe(
      map(resp => {
        const rows = Array.isArray(resp) ? resp : (Array.isArray(resp?.data) ? resp.data : []);
        return rows.map(this.toFront);
      }),
      catchError(err => {
        console.error('Error en getAllUsers:', err);
        return throwError(() => err);
      })
    );
  }

  getById(id: string): Observable<Usuario> {
    return this.http.get<any>(`${USERS_BASE}/usuario/${encodeURIComponent(id)}`, {
      headers: this.authHeaders()
    }).pipe(map(this.toFront));
  }

  create(u: Usuario): Observable<Usuario> {
    return this.http.post<any>(`${USERS_BASE}/signup/1`, u, {
      headers: this.authHeaders(),
      responseType: 'text' as 'json'
    }).pipe(map(this.toFront));
  }

  update(u: Usuario): Observable<Usuario> {
    return this.http.put<any>(`${USERS_BASE}/updateUser`, u, {
      headers: this.authHeaders(),
      responseType: 'text' as 'json'
    }).pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${USERS_BASE}/deleteUser/${encodeURIComponent(id)}`, {
      headers: this.authHeaders(),
      responseType: 'text' as 'json'
    });
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token en localStorage.');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private toFront = (r: any): Usuario => ({
    idUsuario: r.idUsuario ?? r.IdUsuario,
    nombre: r.nombre ?? r.Nombre,
    apellido: r.apellido ?? r.Apellido,
    fechaNacimiento: r.fechaNacimiento ?? r.FechaNacimiento ?? null,

    correoElectronico: r.correoElectronico ?? r.CorreoElectronico ?? null,
    telefonoMovil: r.telefonoMovil ?? r.TelefonoMovil ?? null,
    pregunta: r.pregunta ?? r.Pregunta ?? null,
    respuesta: r.respuesta ?? r.Respuesta ?? null,

    ultimaFechaIngreso: r.ultimaFechaIngreso ?? r.UltimaFechaIngreso ?? r.ultimafecha_ingreso ?? null,
    intentosDeAcceso: r.intentosDeAcceso ?? r.IntentosDeAcceso ?? 0,
    sesionActual: r.sesionActual ?? r.SesionActual ?? null,
    ultimaFechaCambioPassword: r.ultimaFechaCambioPassword ?? r.UltimaFechaCambioPassword ?? null,
    requiereCambiarPassword: r.requiereCambiarPassword ?? r.RequiereCambiarPassword ?? 0,

    fotografia: r.fotografia ?? r.Fotografia ?? null,

    // IDs normalizados
    idGenero: r.idGenero ?? r.IdGenero ?? null,
    idStatusUsuario: r.idStatusUsuario ?? r.IdStatusUsuario ?? r.idStatusUsuario ?? null,
    idRole: r.idRole ?? r.IdRole ?? null,
    idSucursal: r.idSucursal ?? r.IdSucursal ?? null,

    fechaCreacion: r.fechaCreacion ?? r.FechaCreacion ?? null,
    usuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion ?? null,
    fechaModificacion: r.fechaModificacion ?? r.FechaModificacion ?? null,
    usuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion ?? null,

    fechabloqueo: r.fechabloqueo ?? null,
    ultimafecha_ingreso: r.ultimafecha_ingreso ?? null,
    password: r.password ?? null
  });

  private toBack(u: Usuario): any {
    return {
      IdUsuario: u.idUsuario,
      Nombre: u.nombre,
      Apellido: u.apellido,
      FechaNacimiento: u.fechaNacimiento ?? null,
      Password: u.password ?? null,

      CorreoElectronico: u.correoElectronico ?? null,
      TelefonoMovil: u.telefonoMovil ?? null,
      Pregunta: u.pregunta ?? null,
      Respuesta: u.respuesta ?? null,

      IdGenero: u.idGenero,
      IdStatusUsuario: u.idStatusUsuario,
      IdSucursal: u.idSucursal,
      IdRole: u.idRole,
      FechaCreacion: u.fechaCreacion ?? null,
      UsuarioCreacion: u.usuarioCreacion ?? null,
      FechaModificacion: u.fechaModificacion ?? null,
      UsuarioModificacion: u.usuarioModificacion ?? null,
      // Si mandas base64:
      Fotografia: u.fotografia ?? null
    };
  }

  // Login, igual que tenías
  login(username: string, password: string) {
    const body = { idUsuario: username, password };
    return this.http.post(LOGIN_URL, body, { responseType: 'text' as 'json' }).pipe(
      map((response: any) => {
        let token = '';
        if (typeof response === 'string') {
          const match = response.match(/token:\s*(.+)/i);
          token = match ? match[1] : response;
        }
        if (!token) throw new Error('No se recibió token');
        localStorage.setItem('token', token);
        return { username, token };
      })
    );
  }
}
