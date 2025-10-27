import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConsultasBusquedasService {
  private API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  exportarPDF(valorBusqueda: number, tipo: string, anio: number, mes: number): Observable<Blob> {
    const url = `${this.API_URL}/pdf?valorBusqueda=${valorBusqueda}&tipo=${tipo}&anio=${anio}&mes=${mes}`;
    return this.http.post(url, {}, { headers: this.authHeaders(), responseType: 'blob' });
  }

  exportarExcel(valorBusqueda: number, tipo: string, anio: number, mes: number): Observable<Blob> {
    const url = `${this.API_URL}/export-excel?valorBusqueda=${valorBusqueda}&tipo=${tipo}&anio=${anio}&mes=${mes}`;
    return this.http.get(url, { headers: this.authHeaders(), responseType: 'blob' });
  }
}
