import { CierreMes} from './../Models/cierremes.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';


const CIERREMES_URL= 'http://localhost:8080/api/cierre';

@Injectable({ providedIn: 'root' })
export class CierreMesService {
  ejecutarCierre(payload: CierreMes) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}

  private authHeaders(multipart = false): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token retrieved from localStorage:', token);
    if (!token) throw new Error('No hay token en localStorage. Inicia sesión primero.');

    let headers = new HttpHeaders({ Authorization: `Bearer ${token}`  });
    console.log('Autorizacion:', headers);
    return headers;
  }

  getById(id: string): Observable<CierreMes> {
    return this.http.get<any>(`${CIERREMES_URL}/${encodeURIComponent(id)}`).pipe(
      map(this.toFront)
    );
  }




  ejecutar(data: CierreMes): Observable<CierreMes> {
    const params = new HttpParams()
        // Omitimos Anio y Mes, solo enviamos el usuario, que era el parámetro original del Controller
        .set('usuario', data.IdUsuario ?? '');

    // La petición POST debe llevar un cuerpo vacío si los datos van en params
    return this.http.post<CierreMes>(
        `${CIERREMES_URL}/ejecutar`,
        {},
        {
            params: params, // Solo se envía el usuario en la URL
            headers: this.authHeaders(false)
        }
    );
}




  private toFront = (r: any): CierreMes => ({
    Anio: r.anio ?? r.Anio ?? '',
    Mes: r.mes ?? r.Mes ?? '',
    FechaInicio: r.fechaInicio ?? r.FechaInicio,
    FechaFinal: r.fechaFinal ?? r.FechaFinal,
    FechaCierre: r.fechaCierre ?? r.FechaCierre,
    success: r.success,
    message: r.message,
    IdUsuario: r.idUsuario ?? r.IdUsuario ?? '',
  });

  private toBack(s: CierreMes): any {
    return {
      Anio: s.Anio,
      Mes: s.Mes,
      FechaInicio: s.FechaInicio,
      FechaFinal: s.FechaFinal,
      FechaCierre: s.FechaCierre,
      IdUsuario: s.IdUsuario,
    };
  }
}

