import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Usuario } from '../Models/usuario.model';

// ajusta tu base URL (o usa environment)
const BASE = 'http://localhost:8080/api/usuarios';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Usuario[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page != null) params = params.set('page', q.page);
    if (q?.size != null) params = params.set('size', q.size);

    return this.http.get<any[]>(BASE, { params }).pipe(
      map(rows => rows.map(this.toFront))
    );
  }

  getById(id: string): Observable<Usuario> {
    return this.http.get<any>(`${BASE}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(u: Usuario, file?: File): Observable<Usuario> {
    // Si vas a subir fotografía, usa FormData:
    if (file) {
      const fd = this.toFormData(u, file);
      return this.http.post<any>(BASE, fd).pipe(map(this.toFront));
    }
    return this.http.post<any>(BASE, this.toBack(u)).pipe(map(this.toFront));
  }

  update(id: string, u: Usuario, file?: File): Observable<Usuario> {
    if (file) {
      const fd = this.toFormData(u, file);
      return this.http.put<any>(`${BASE}/${encodeURIComponent(id)}`, fd).pipe(map(this.toFront));
    }
    return this.http.put<any>(`${BASE}/${encodeURIComponent(id)}`, this.toBack(u)).pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/${encodeURIComponent(id)}`);
  }

  // Catálogos (ajusta a tus endpoints reales)
  getGeneros() { return this.http.get<{id:number; nombre:string}[]>('http://localhost:8080/api/generos'); }
  getEstatus() { return this.http.get<{id:number; nombre:string}[]>('http://localhost:8080/api/estatus-usuario'); }
  getSucursales(){return this.http.get<{id:number; nombre:string}[]>('http://localhost:8080/api/sucursales'); }

  // ---- helpers: mapeo API <-> Front ----
  private toFront = (r: any): Usuario => ({
    idUsuario: r.idUsuario ?? r.IdUsuario,
    nombre: r.nombre ?? r.Nombre,
    apellido: r.apellido ?? r.Apellido,
    fechaNacimiento: r.fechaNacimiento ?? r.FechaNacimiento,
    idStatusUsuario: r.idStatusUsuario ?? r.IdStatusUsuario,
    password: r.password ?? r.Password,
    idGenero: r.idGenero ?? r.IdGenero,
    ultimaFechaIngreso: r.ultimaFechaIngreso ?? r.UltimaFechaIngreso ?? r.ultimafecha_ingreso,
    intentosDeAcceso: r.intentosDeAcceso ?? r.IntentosDeAcceso,
    sesionActual: r.sesionActual ?? r.SesionActual,
    ultimaFechaCambioPassword: r.ultimaFechaCambioPassword ?? r.UltimaFechaCambioPassword,
    correoElectronico: r.correoElectronico ?? r.CorreoElectronico,
    requiereCambiarPassword: r.requiereCambiarPassword ?? r.RequiereCambiarPassword,
    fotografia: r.fotografia ?? r.Fotografia ?? null,
    telefonoMovil: r.telefonoMovil ?? r.TelefonoMovil,
    idSucursal: r.idSucursal ?? r.IdSucursal,
    pregunta: r.pregunta ?? r.Pregunta,
    respuesta: r.respuesta ?? r.Respuesta,
    fechaCreacion: r.fechaCreacion ?? r.FechaCreacion,
    usuarioCreacion: r.usuarioCreacion ?? r.UsuarioCreacion,
    fechaModificacion: r.fechaModificacion ?? r.FechaModificacion,
    usuarioModificacion: r.usuarioModificacion ?? r.UsuarioModificacion,
    fechabloqueo: r.fechabloqueo,
    ultimafecha_ingreso: r.ultimafecha_ingreso
  });

  private toBack(u: Usuario): any {
    // Ajusta al naming de tu API (ej. PascalCase si usas JPA con nombres exactos)
    return {
      IdUsuario: u.idUsuario,
      Nombre: u.nombre,
      Apellido: u.apellido,
      FechaNacimiento: u.fechaNacimiento,
      IdStatusUsuario: u.idStatusUsuario,
      Password: u.password,
      IdGenero: u.idGenero,
      UltimaFechaIngreso: u.ultimaFechaIngreso,
      IntentosDeAcceso: u.intentosDeAcceso,
      SesionActual: u.sesionActual,
      UltimaFechaCambioPassword: u.ultimaFechaCambioPassword,
      CorreoElectronico: u.correoElectronico,
      RequiereCambiarPassword: u.requiereCambiarPassword,
      TelefonoMovil: u.telefonoMovil,
      IdSucursal: u.idSucursal,
      Pregunta: u.pregunta,
      Respuesta: u.respuesta,
      // Fotografia: se manda por FormData si hay archivo
    };
  }

  private toFormData(u: Usuario, file: File): FormData {
    const fd = new FormData();
    Object.entries(this.toBack(u)).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v));
    });
    fd.append('Fotografia', file, file.name);
    return fd;
  }
}
