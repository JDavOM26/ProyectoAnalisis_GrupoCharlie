import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsultaSaldosService } from '../../Service/saldocliente.service';
import { SaldoCliente } from '../../Models/saldocliente.model';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-consulta-saldos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './saldocliente.html',

})
export class ConsultaSaldosComponent implements OnInit {
  form!: FormGroup;

  cargando = signal(false);
  resultado = signal<SaldoCliente | null>(null);
  mensajeError = signal('');

  // Opciones de búsqueda basadas en el campo WHERE de la consulta SQL
  tiposBusqueda = [
    // El valor (value) debe coincidir con los literales usados en el SQL de Java
    { value: 'idPersona', name: 'ID de Persona' },
    { value: 'idSaldoCuenta', name: 'ID de cuenta' },
    { value: 'nombreApellido', name: 'Nombre y Apellido' }
  ];

  constructor(
    private fb: FormBuilder,
    private saldoSvc: ConsultaSaldosService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      valorBusqueda: ['', Validators.required],
      tipo: [this.tiposBusqueda[0].value, Validators.required]
    });
  }

  consultarSaldo() {
    this.mensajeError.set('');
    this.resultado.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeError.set('Por favor, complete los campos requeridos.');
      return;
    }

    this.cargando.set(true);

    const { valorBusqueda, tipo } = this.form.value;

    this.saldoSvc.obtenerSaldoCliente(valorBusqueda, tipo)
      .pipe(
        catchError(err => {
          this.cargando.set(false);
          // Manejar 404/NO_CONTENT
          const status = err.status;
          let errorMsg = 'Error de conexión o datos no encontrados.';

          if (status === 404 || status === 204) { // NO_CONTENT (204) es manejado como error en algunos servicios
             errorMsg = 'No se encontraron saldos para el criterio de búsqueda.';
          } else {
             errorMsg = err.error?.message || err.message || errorMsg;
          }

          this.mensajeError.set(`Fallo la consulta: ${errorMsg}`);
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (resp) => {
          this.cargando.set(false);
          // El backend retorna un mapa. Si está vacío, el controller retorna NO_CONTENT (204).
          // Si hay datos, lo asignamos.
          if (resp && Object.keys(resp).length > 0) {
            this.resultado.set(resp);
          } else {
             this.mensajeError.set('Consulta exitosa, pero no se encontraron saldos para el criterio.');
          }
        },
        error: () => {
          this.cargando.set(false);
        },
      });
  }

  limpiar() {
    this.form.reset({
        tipo: this.tiposBusqueda[0].value
    });
    this.resultado.set(null);
    this.mensajeError.set('');
  }
}
