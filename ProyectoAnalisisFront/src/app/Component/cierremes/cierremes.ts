import { CierreMesService } from '../../Service/cierremes.service';
import { Component, OnInit, signal } from '@angular/core'; // Añadir OnInit
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Importar ReactiveFormsModule y relacionados
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

  constructor(
    private fb: FormBuilder,
    private cierreSvc: CierreMesService
  ) {}

 ngOnInit(): void {
    const hoy = new Date();
    this.form = this.fb.group({
      anio: [hoy.getFullYear().toString(), [Validators.required]],
      mes: [(hoy.getMonth() + 1).toString(), [Validators.required, Validators.min(1)]]    });
}

  ejecutarCierreMensual() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mostrarResultado('Por favor, seleccione un Año y Mes válidos.', true);
      return;
    }

    const usuario = localStorage.getItem('username');
    if (!usuario) {
      this.mostrarResultado('Error: No se encontró el nombre de usuario.', true);
      return;
    }

    const { anio,mes } = this.form.value;
    if (!confirm(`¿Está seguro de que desea ejecutar el Cierre Mensual para ${mes}/${anio}?`)) {
      return;
    }

    this.ejecutando.set(true);
    this.mensaje.set('Ejecutando cierre mensual...');
    this.esError.set(false);

    const payload: CierreMes = {
    Anio: anio,
   Mes: mes,
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
        error: () => {
          this.ejecutando.set(false);
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

