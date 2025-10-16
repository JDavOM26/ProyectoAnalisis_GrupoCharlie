import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Persona } from '../Models/persona.model';
//import { provideHttpClient } from '@angular/common/http';

const PERSONA_URL = 'http://localhost:8080/api/auth/';

@Injectable({ providedIn: 'root' })
export class PersonaService {
  constructor(private http: HttpClient) { }

  list(q?: { search?: string; page?: number; size?: number }): Observable<{
    content: Persona[];
    totalPages: number;
    totalElements: number;
    pageNumber: number;
  }> {
    const page = q?.page ?? 0;
    const size = q?.size ?? 10;

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (q?.search) {
      params = params.set('search', q.search);
    }

    return this.http.get<any>(PERSONA_URL+'obtener/personas-paginado/', {
      params,
      headers: this.authHeaders(true)
    }).pipe(
      map(resp => {
        const content = Array.isArray(resp?.content) ? resp.content : [];

        return {
          content: content.map(this.toFront),
          totalPages: resp?.totalPages ?? 1,
          totalElements: resp?.totalElements ?? content.length,
          pageNumber: resp?.number ?? 0
        };
      }),
      catchError(err => {
        console.error('Error en list personas:', err);
        return throwError(() => err);
      })
    );
  }

  private authHeaders(multipart = false): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token retrieved from localStorage:', token);
    if (!token) throw new Error('No hay token en localStorage. Inicia sesión primero.');

    let headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    console.log('Autorizacion:', headers);
    return headers;
  }

  getById(id: string): Observable<Persona> {
    return this.http.get<any>(`${PERSONA_URL}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(u: Persona): Observable<Persona> {
    u.UsuarioCreacion = localStorage.getItem('username')?.toString();
    return this.http.post<any>(PERSONA_URL + 'personas/crear', this.toBack(u), {
      headers: this.authHeaders()})
      .pipe(map(this.toFront));
  }
  toFormData(u: Persona) {
    throw new Error('Method not implemented.');
  }

  update(id: string, u: Persona): Observable<Persona> {
    u.UsuarioModificacion = localStorage.getItem('username')?.toString();
    return this.http.put<any>(`${PERSONA_URL}personas/actualizar/${encodeURIComponent(id)}`, this.toBack(u), {
      headers: this.authHeaders()
    })
      .pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${PERSONA_URL}personas/eliminar/${encodeURIComponent(id)}`, {
      headers: this.authHeaders(),
      responseType: 'text' as 'json'
    });
  }


  private toFront = (r: any): Persona => ({
    IdPersona: r.idPersona,
    Nombre: r.nombre,
    Apellido: r.apellido,
    FechaNacimiento: r.fechaNacimiento,
    IdGenero: r.idGenero,
    Direccion: r.direccion,
    Telefono: r.telefono,
    CorreoElectronico: r.correoElectronico,
    IdEstadoCivil: r.idEstadoCivil,
    FechaCreacion: r.fechaCreacion,
    UsuarioCreacion: r.usuarioCreacion,
    FechaModificacion: r.fechaModificacion,
    UsuarioModificacion: r.usuarioModificacion
  });

  private toBack(s: Persona): any {
    return {
      idPersona: s.IdPersona,
      nombre: s.Nombre,
      apellido: s.Apellido,
      fechaNacimiento: s.FechaNacimiento,
      idGenero: s.IdGenero,
      direccion: s.Direccion,
      telefono: s.Telefono,
      correoElectronico: s.CorreoElectronico,
      idEstadoCivil: s.IdEstadoCivil,
      fechaCreacion: s.FechaCreacion,
      usuarioCreacion: s.UsuarioCreacion,
      fechaModificacion: s.FechaModificacion,
      usuarioModificacion: s.UsuarioModificacion
    };
  }
}

