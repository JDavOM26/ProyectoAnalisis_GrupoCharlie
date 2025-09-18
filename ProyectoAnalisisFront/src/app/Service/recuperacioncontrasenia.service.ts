import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { PasswordRecoveryResponseDto } from '../Models/password-recovery-response.dto';
import { PasswordRecoveryAnswerDto } from '../Models/password-recovery-answer.dto';
import { catchError, map, Observable, throwError } from 'rxjs';
const BASE_URL = 'http://localhost:8080/api/noauth';
@Injectable({
  providedIn: 'root'
})
export class RecuperacioncontraseniaService {

    constructor(private http: HttpClient) {}
  

  getPregunta(idUsuario: string): Observable<PasswordRecoveryResponseDto> {
  
    const url = `${BASE_URL}/obtener-pregunta/${idUsuario}`;

    return this.http.get<PasswordRecoveryResponseDto>(url).pipe(
      map((response: PasswordRecoveryResponseDto) => response),
      catchError((error) => {
      
        let errorMessage = 'Ocurrió un error al obtener la pregunta';

        if (error.status === 401) {
          errorMessage = error.error || 'Usuario o contraseña inválidos';
        } else if (error.status === 423) {
          errorMessage = error.error || 'Cuenta bloqueada por demasiados intentos fallidos';
        } else if (error.status === 404) {
          errorMessage = error.error || 'Usuario no encontrado';
        } else if (error.status === 500) {
          errorMessage = error.error || 'Error interno del servidor';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

 postRespuesta(answerDto: PasswordRecoveryAnswerDto): Observable<boolean> {
    const url = `${BASE_URL}/verificar-respuesta`;

    return this.http.post<boolean>(url, answerDto).pipe(
      map((response: boolean) => response),
      catchError((error) => {
        let errorMessage = 'Ocurrió un error al verificar la respuesta';

        if (error.status === 400) {
          errorMessage = error.error || 'Debe ingresar una respuesta válida';
        } else if (error.status === 401) {
          errorMessage = error.error || 'Usuario o respuesta inválidos';
        } else if (error.status === 423) {
          errorMessage = error.error || 'Cuenta bloqueada por demasiados intentos fallidos';
        } else if (error.status === 500) {
          errorMessage = error.error || 'Error interno del servidor';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
  
sendEmail(idUsuario: string): Observable<string> {
    const url = `${BASE_URL}/send-email/${idUsuario}`;

    return this.http.post(url, null, { responseType: 'text' }).pipe(
      map((response: string) => response),
      catchError((error) => {
        let errorMessage = 'Ocurrió un error al enviar el correo';

        if (error.status === 404) {
          errorMessage = error.error || 'Usuario no encontrado';
        } else if (error.status === 401) {
          errorMessage = error.error || 'Usuario o contraseña inválidos';
        } else if (error.status === 423) {
          errorMessage = error.error || 'Cuenta bloqueada por demasiados intentos fallidos';
        } else if (error.status === 500) {
          errorMessage = error.error || 'Error interno del servidor';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}