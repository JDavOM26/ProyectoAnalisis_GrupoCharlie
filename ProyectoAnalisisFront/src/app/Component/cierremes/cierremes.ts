import { CierreMesService } from '../../Service/cierremes.service';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CierreMes } from '../../Models/cierremes.model';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'cierremes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cierremes.html',
})
export class CierreMensualComponent implements OnInit {
  form!: FormGroup;

  ejecutando = signal(false);
  mensaje = signal('');
  esError = signal(false);

 
  anioActual = signal(0);
  mesActual = signal(0);
  mesActualTexto = signal('');

  private meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(
    private fb: FormBuilder,
    private cierreSvc: CierreMesService
  ) {}

  ngOnInit(): void {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = hoy.getMonth() + 1; 

    this.anioActual.set(anio);
    this.mesActual.set(mes);
    this.mesActualTexto.set(`${mes} - ${this.meses[mes - 1]}`);

    
    this.form = this.fb.group({});
  }

  ejecutarCierreMensual() {
    const usuario = localStorage.getItem('username');
    if (!usuario) {
      this.mostrarResultado('Error: No se encontró el nombre de usuario.', true);
      return;
    }

    if (!confirm(`¿Está seguro de que desea ejecutar el Cierre Mensual para ${this.mesActualTexto()} ${this.anioActual()}?`)) {
      return;
    }

    this.ejecutando.set(true);
    this.mensaje.set('Ejecutando cierre mensual...');
    this.esError.set(false);

    const payload: CierreMes = {
      Anio: this.anioActual().toString(),
      Mes: this.mesActual().toString(),
      IdUsuario: usuario,
      success: false,
      message: ''
    };

    this.cierreSvc.ejecutar(payload)
      .pipe(
        catchError(err => {
          const errorMsg = err.error?.message || 'Error desconocido al ejecutar el cierre.';
          this.mostrarResultado(`Fallo la petición: ${errorMsg}`, true);
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.mostrarResultado(resp.message, false);
          } else {
            this.mostrarResultado(resp.message, true);
          }
        },
        complete: () => {
          this.ejecutando.set(false);
        }
      });
  }

  private mostrarResultado(msg: string, isError: boolean) {
    this.mensaje.set(msg);
    this.esError.set(isError);
  }

  limpiarResultado() {
    this.mensaje.set('');
    this.esError.set(false);
  }
}