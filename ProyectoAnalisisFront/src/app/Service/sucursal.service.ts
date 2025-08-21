import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Sucursal } from '../Models/sucursal.model';

// ajusta tu base URL (o usa environment)
const BASE = 'http://localhost:8080/api/sucursales';

@Injectable({ providedIn: 'root' })
export class SucursalService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Sucursal[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page != null) params = params.set('page', q.page);
    if (q?.size != null) params = params.set('size', q.size);

    return this.http.get<any[]>(BASE, { params }).pipe(
      map(rows => rows.map(this.toFront))
    );
  }

  getById(id: string): Observable<Sucursal> {
    return this.http.get<any>(`${BASE}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(s: Sucursal, fotoFile: File | undefined): Observable<Sucursal> {
    return this.http.post<any>(BASE, this.toBack(s)).pipe(map(this.toFront));
  }

  update(id: string, s: Sucursal, fotoFile: File | undefined): Observable<Sucursal> {
    return this.http.put<any>(`${BASE}/${encodeURIComponent(id)}`, this.toBack(s)).pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/${encodeURIComponent(id)}`);
  }

  // Catálogos (ajusta a tus endpoints reales, por ejemplo para empresas relacionadas)

  getEmpresas() { return this.http.get<{id:number; nombre:string}[]>('http://localhost:8080/api/empresas'); }


  // ---- helpers: mapeo API <-> Front ----
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
    // Ajusta al naming de tu API (ej. PascalCase si usas JPA con nombres exactos)
    return {
      IdSucursal: s.IdSucursal,
      Nombre: s.Nombre,
      Direccion: s.Direccion,
      IdEmpresa: s.IdEmpresa,
      FechaCreacion: s.FechaCreacion,
      UsuarioCreacion: s.UsuarioCreacion,
      FechaModificacion:  s.FechaModificacion,
      UsuarioModificacion: s.UsuarioModificacion
    };
  }
}
