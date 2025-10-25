import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { SaldoCuenta } from '../Models/saldo_cuenta.model';

const SALDOCUENTA_URL = 'http://localhost:8080/api/auth/';

@Injectable({ providedIn: 'root' })
export class SaldoCuentaService {
  constructor(private http: HttpClient) { }

  list(q?: { search?: string; page?: number; size?: number }): Observable<{
    content: SaldoCuenta[];
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

    return this.http.get<any>(SALDOCUENTA_URL + 'obtener/saldos-paginado', {
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
        console.error('Error en list SaldoCuentas:', err);
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

  getByIdPersona(id: number): Observable<SaldoCuenta> {
    return this.http.get<any>(`${SALDOCUENTA_URL}obtener/saldos-persona/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }

  create(u: SaldoCuenta): Observable<SaldoCuenta> {
    u.UsuarioCreacion = localStorage.getItem('username')?.toString();
    return this.http.post<any>(SALDOCUENTA_URL + 'crear/saldos', this.toBack(u), {
      headers: this.authHeaders()
    })
      .pipe(map(this.toFront));
  }
  toFormData(u: SaldoCuenta) {
    throw new Error('Method not implemented.');
  }

  update(id: string, u: SaldoCuenta): Observable<SaldoCuenta> {
    u.UsuarioModificacion = localStorage.getItem('username')?.toString();
    return this.http.put<any>(`${SALDOCUENTA_URL}actualizar/saldos/${encodeURIComponent(id)}`, this.toBack(u), {
      headers: this.authHeaders()
    })
      .pipe(map(this.toFront));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${SALDOCUENTA_URL}eliminar/saldos/${encodeURIComponent(id)}`, {
      headers: this.authHeaders(),
      responseType: 'text' as 'json'
    });
  }


  private toFront = (r: any): SaldoCuenta => ({
    IdSaldoCuenta: r.idSaldoCuenta,
    IdPersona: r.idPersona,
    IdStatusCuenta: r.idStatusCuenta,
    IdTipoSaldoCuenta: r.idTipoSaldoCuenta,
    SaldoAnterior: r.saldoAnterior,
    Debitos: r.debitos,
    Creditos: r.creditos,
    FechaCreacion: r.fechaCreacion,
    UsuarioCreacion: r.usuarioCreacion,
    FechaModificacion: r.fechaModificacion,
    UsuarioModificacion: r.usuarioModificacion
  });

  private toBack(s: SaldoCuenta): any {
    return {
      idSaldoCuenta: s.IdSaldoCuenta,
      idPersona: s.IdPersona,
      idStatusCuenta: s.IdStatusCuenta,
      idTipoSaldoCuenta: s.IdTipoSaldoCuenta,
      saldoAnterior: s.SaldoAnterior,
      debitos: s.Debitos,
      creditos: s.Creditos,
      fechaCreacion: s.FechaCreacion,
      usuarioCreacion: s.UsuarioCreacion,
      fechaModificacion: s.FechaModificacion,
      usuarioModificacion: s.UsuarioModificacion
    };
  }
}

