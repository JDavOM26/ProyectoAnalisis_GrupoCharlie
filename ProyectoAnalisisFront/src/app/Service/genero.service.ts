import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Genero } from '../Models/genero.model';

// ajusta tu base URL (o usa environment)
const BASE = 'http://localhost:8080/api/generos';

@Injectable({ providedIn: 'root' })
export class GeneroService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Genero[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page != null) params = params.set('page', q.page);
    if (q?.size != null) params = params.set('size', q.size);

    return this.http.get<any[]>(BASE, { params }).pipe(
      map(rows => rows.map(this.toFront))
    );
  }

  getById(id: string): Observable<Genero> {
    return this.http.get<any>(`${BASE}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(s: Genero, fotoFile: File | undefined): Observable<Genero> {
    return this.http.post<any>(BASE, this.toBack(s)).pipe(map(this.toFront));
  }

  update(id: string, s: Genero, fotoFile: File | undefined): Observable<Genero> {
    return this.http.put<any>(`${BASE}/${encodeURIComponent(id)}`, this.toBack(s)).pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/${encodeURIComponent(id)}`);
  }
  // ---- helpers: mapeo API <-> Front ----
  private toFront = (r: any): Genero => ({

     IdGenero: r.IdGenero ?? r.IdGenero,
    Nombre: r.nombre ?? r.Nombre,
    FechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    UsuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    FechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    UsuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion
  });

  private toBack(s: Genero): any {
    // Ajusta al naming de tu API (ej. PascalCase si usas JPA con nombres exactos)
    return {
      IdGenero: s.IdGenero,
      Nombre: s.Nombre,
      FechaCreacion: s.FechaCreacion,
      UsuarioCreacion: s.UsuarioCreacion,
      FechaModificacion:  s.FechaModificacion,
      UsuarioModificacion: s.UsuarioModificacion
    };
  }
}
