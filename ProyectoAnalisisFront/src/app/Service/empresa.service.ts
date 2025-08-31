import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Empresa } from '../Models/empresa.model';
import { catchError, throwError } from 'rxjs';

// Ajusta la URL exactamente como expone tu API
const BASE = 'http://localhost:8080/api/auth/empresa';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  constructor(private http: HttpClient) {}

  list(q?: { search?: string; page?: number; size?: number }): Observable<Empresa[]> {
    let params = new HttpParams();
    if (q?.search) params = params.set('search', q.search);
    if (q?.page != null) params = params.set('page', q.page);
    if (q?.size != null) params = params.set('size', q.size);

    return this.http.get<any>(BASE+'/GetEmpresas', { 
      params,
      headers: this.authHeaders() 
    }).pipe(
          map(resp => {
            console.log('Respuesta cruda GetEmpresas:', resp);
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
            console.error('Error en GetEmpresas:', err);
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

  create(bodyEmpresa: Empresa): Observable<Empresa> {
    return this.http
      .post<any>(`${BASE}/CrearEmpresa`, bodyEmpresa, { headers: this.authHeaders() })
      .pipe(map(this.toFront));
  }

  update(bodyEmpresa: Empresa): Observable<Empresa> {
    return this.http
      .put<any>(`${BASE}/ActualizarEmpresa`,bodyEmpresa,{ headers: this.authHeaders() })
      .pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${BASE}/BorrarEmpresa?idEmpresa=${encodeURIComponent(id)}`,
      { headers: this.authHeaders() }
    );
  }

  getById(id: string): Observable<Empresa> {
    return this.http.get<any>(
      `${BASE}/${encodeURIComponent(id)}`,
      { headers: this.authHeaders(true) }              // <= token aquí
    ).pipe(map(this.toFront));
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
      PasswordCantidadPreguntasValidar: e.passwordCantidadPreguntasValidar
    };
  }
}
