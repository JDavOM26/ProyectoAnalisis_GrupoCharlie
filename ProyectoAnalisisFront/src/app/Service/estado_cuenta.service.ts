import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EstadoCuentaService {
  private API_URL = 'http://localhost:8080/api/auth/obtener-movimiento-cuenta';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  obtenerMovimientos(valorBusqueda: number, tipo: string, anio: number, mes: number): Observable<any[]> {
    const url = `${this.API_URL}?valorBusqueda=${valorBusqueda}&tipo=${tipo}&anio=${anio}&mes=${mes}`;
    return this.http.get<any[]>(url, { headers: this.authHeaders() });
  }
}
