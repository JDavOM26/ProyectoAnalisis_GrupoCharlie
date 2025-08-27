import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Empresa } from '../Models/empresa.model';

// Ajusta la URL exactamente como expone tu API
const BASE = 'http://localhost:8080/api/Empresas';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Empresa[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page != null) params = params.set('page', q.page);
    if (q?.size != null) params = params.set('size', q.size);

    return this.http.get<any[]>(BASE, { params }).pipe(map(rows => rows.map(this.toFront)));
  }

  getById(id: string): Observable<Empresa> {
    return this.http.get<any>(`${BASE}/${encodeURIComponent(id)}`).pipe(map(this.toFront));
  }

  create(e: Empresa): Observable<Empresa> {
    return this.http.post<any>(BASE, this.toBackPascal(e)).pipe(map(this.toFront));
  }

  update(id: string, e: Empresa): Observable<Empresa> {
    return this.http.put<any>(`${BASE}/${encodeURIComponent(id)}`, this.toBackPascal(e)).pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/${encodeURIComponent(id)}`);
  }

  // --- MAPEOS ---

  /** Normaliza la respuesta del backend a tu interfaz Empresa (en PascalCase). */
  private toFront = (r: any): Empresa => ({
    idEmpresa: r.IdEmpresa ?? r.idEmpresa ?? r.id_empresa ?? '',
    nombre: r.Nombre ?? r.nombre ?? '',
    direccion: r.Direccion ?? r.direccion ?? '',
    nit: r.Nit ?? r.nit ?? '',

    passwordCantidadMayusculas: r.PasswordCantidadMayusculas ?? r.passwordCantidadMayusculas ?? r.password_cantidad_mayusculas ?? 0,
    passwordCantidadMinusculas: r.PasswordCantidadMinusculas ?? r.passwordCantidadMinusculas ?? r.password_cantidad_minusculas ?? 0,
    passwordCantidadCaracteresEspeciales: r.PasswordCantidadCaracteresEspeciales ?? r.passwordCantidadCaracteresEspeciales ?? r.password_cantidad_caracteres_especiales ?? 0,
    passwordCantidadCaducidadDias: r.PasswordCantidadCaducidadDias ?? r.passwordCantidadCaducidadDias ?? r.password_cantidad_caducidad_dias ?? 0,
    passwordLargo: r.PasswordLargo ?? r.passwordLargo ?? r.password_largo ?? 0,
    passwordIntentosAntesDeBloquear: r.PasswordIntentosAntesDeBloquear ?? r.passwordIntentosAntesDeBloquear ?? r.password_intentos_antes_de_bloquear ?? 0,
    passwordCantidadNumeros: r.PasswordCantidadNumeros ?? r.passwordCantidadNumeros ?? r.password_cantidad_numeros ?? 0,
    passwordCantidadPreguntasValidar: r.PasswordCantidadPreguntasValidar ?? r.passwordCantidadPreguntasValidar ?? r.password_cantidad_preguntas_validar ?? 0,

    fechaCreacion: r.FechaCreacion ?? r.fechaCreacion ?? r.fecha_creacion ?? null as any,
    usuarioCreacion: r.UsuarioCreacion ?? r.usuarioCreacion ?? r.usuario_creacion ?? '',
    fechaModificacion: r.FechaModificacion ?? r.fechaModificacion ?? r.fecha_modificacion ?? null as any,
    usuarioModificacion: r.UsuarioModificacion ?? r.usuarioModificacion ?? r.usuario_modificacion ?? '',

    // Campos duplicados en snake_case (tu modelo los define, así que los rellenamos)
    fecha_creacion: r.Fecha_creacion ?? r.fecha_creacion ?? r.FechaCreacion ?? null as any,
    fecha_modificacion: r.Fecha_modificacion ?? r.fecha_modificacion ?? r.FechaModificacion ?? null as any,
    password_cantidad_caracteres_especiales:
      r.Password_cantidad_caracteres_especiales ?? r.password_cantidad_caracteres_especiales ?? r.PasswordCantidadCaracteresEspeciales ?? 0,
    password_cantidad_mayusculas:
      r.Password_cantidad_mayusculas ?? r.password_cantidad_mayusculas ?? r.PasswordCantidadMayusculas ?? 0,
    password_cantidad_minusculas:
      r.Password_cantidad_minusculas ?? r.password_cantidad_minusculas ?? r.PasswordCantidadMinusculas ?? 0,
    password_cantidad_caducidad_dias:
      r.Password_cantidad_caducidad_dias ?? r.password_cantidad_caducidad_dias ?? r.PasswordCantidadCaducidadDias ?? 0,
    password_cantidad_numeros:
      r.Password_cantidad_numeros ?? r.password_cantidad_numeros ?? r.PasswordCantidadNumeros ?? 0,
    password_cantidad_preguntas_validar:
      r.Password_cantidad_preguntas_validar ?? r.password_cantidad_preguntas_validar ?? r.PasswordCantidadPreguntasValidar ?? 0,
    password_intentos_antes_de_bloquear:
      r.Password_intentos_antes_de_bloquear ?? r.password_intentos_antes_de_bloquear ?? r.PasswordIntentosAntesDeBloquear ?? 0,
    password_largo:
      r.Password_largo ?? r.password_largo ?? r.PasswordLargo ?? 0,
    usuario_creacion: r.Usuario_creacion ?? r.usuario_creacion ?? r.UsuarioCreacion ?? '',
    usuario_modificacion: r.Usuario_modificacion ?? r.usuario_modificacion ?? r.UsuarioModificacion ?? '',
  });

  /** Payload en PascalCase (útil si tu API/JPA espera estos nombres exactos). */
  private toBackPascal(e: Empresa): any {
    return {
      IdEmpresa: e.idEmpresa,
      Nombre: e.nombre,
      Direccion: e.direccion,
      Nit: e.nit,

      PasswordCantidadMayusculas: e.passwordCantidadMayusculas,
      PasswordCantidadMinusculas: e.passwordCantidadMinusculas,
      PasswordCantidadCaracteresEspeciales: e.passwordCantidadCaracteresEspeciales,
      PasswordCantidadCaducidadDias: e.passwordCantidadCaducidadDias,
      PasswordLargo: e.passwordLargo,
      PasswordIntentosAntesDeBloquear: e.passwordIntentosAntesDeBloquear,
      PasswordCantidadNumeros: e.passwordCantidadNumeros,
      PasswordCantidadPreguntasValidar: e.passwordCantidadPreguntasValidar,

      FechaCreacion: e.fechaCreacion,
      UsuarioCreacion: e.usuarioCreacion,
      FechaModificacion: e.fechaModificacion,
      UsuarioModificacion: e.usuarioModificacion
    };
  }
}
