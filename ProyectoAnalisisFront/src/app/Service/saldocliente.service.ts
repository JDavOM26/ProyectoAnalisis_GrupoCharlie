import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaldoCliente } from '../Models/saldocliente.model';

// URL base del controlador: @RequestMapping("/api/auth")
const SALDO_URL = 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class ConsultaSaldosService {
  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token en localStorage. Inicia sesión primero.');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /**
   * Obtiene el saldo del cliente.
   * @param valor El valor a buscar (ej. ID de persona, número de cuenta).
   * @param tipo El campo de búsqueda ('idPersona', 'idSaldoCuenta', 'nombreApellido').
   */
  obtenerSaldoCliente(valor: string, tipo: string): Observable<SaldoCliente> {

    // Los nombres de los parámetros deben coincidir exactamente con @RequestParam en Java.
    const params = new HttpParams()
      .set('valorBusqueda', valor) // Coincide con @RequestParam String valorBusqueda
      .set('tipo', tipo);          // Coincide con @RequestParam String tipo

    // Petición GET al endpoint /obtener-saldo-cliente
    return this.http.get<SaldoCliente>(
      `${SALDO_URL}/obtener-saldo-cliente`,
      {
        params: params,
        headers: this.authHeaders()
      }
    );
  }
}
