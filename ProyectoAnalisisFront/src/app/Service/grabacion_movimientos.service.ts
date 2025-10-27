import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

const MOVIMIENTO_URL = 'http://localhost:8080/api/registrar-movimiento';

@Injectable({ providedIn: 'root' })
export class GrabacionMovimientosService {
  constructor(private http: HttpClient) {}

  registrarMovimiento(data: any): Observable<string> {
    return this.http.post(MOVIMIENTO_URL, data, {
      headers: this.authHeaders(),
      responseType: 'text'
    }).pipe(
      map((resp: string) => {
        if (!resp) return '';
        try {
          const parsed = JSON.parse(resp);
          return (parsed && parsed.message) ? String(parsed.message) : String(resp);
        } catch (e) {
          return String(resp);
        }
      }),
      catchError(err => {
        console.error('Error en registrarMovimiento:', err);
        return throwError(() => err);
      })
    );
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
