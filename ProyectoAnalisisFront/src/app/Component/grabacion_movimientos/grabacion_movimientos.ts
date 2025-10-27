import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, startWith, switchMap,map } from 'rxjs';
import { SaldoCuentaService } from '../../Service/saldo_cuenta.service';
import { TipoMovimientoCxCService } from '../../Service/tipo_mov_cxc.service';
import { GrabacionMovimientosService } from '../../Service/grabacion_movimientos.service';
import { SaldoCuenta } from '../../Models/saldo_cuenta.model';
import { TipoMovimientoCxC } from '../../Models/tipo_movimiento_cxc.model';
import { HttpHeaders } from '@angular/common/http';
import { PersonaService } from '../../Service/persona.service';
import { Persona } from '../../Models/persona.model';

@Component({
  selector: 'grabacion_movimientos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './grabacion_movimientos.html',
  styleUrl: './grabacion_movimientos.css'
})
export class GrabacionMovimientosComponent implements OnInit {

  form!: FormGroup;
  saldoCuenta$!: Observable<SaldoCuenta[]>;
  tiposMovimiento$!: Observable<TipoMovimientoCxC[]>;
  personas$!: Observable<Persona[]>;
  personasMap$!: Observable<Record<number, string>>;

  private refresh$ = new BehaviorSubject<void>(undefined);

  constructor(
    private fb: FormBuilder,
    private saldoSvc: SaldoCuentaService,
    private tipoMovSvc: TipoMovimientoCxCService,
    private personaSvc: PersonaService,
    private movSvc: GrabacionMovimientosService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idSaldoCuenta: ['', Validators.required],
      idTipoMovimientoCXC: ['', Validators.required],
      fechaMovimiento: ['', Validators.required],
      valorMovimiento: ['', [Validators.required, Validators.min(0.01)]],
      descripcion: ['', Validators.required]
    });

    this.saldoCuenta$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.saldoSvc.list({ page: 0, size: 200 })),
      map(result => result.content)
    );

    this.tiposMovimiento$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.tipoMovSvc.list({ search: '' }))
    );

    this.personas$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.personaSvc.list({ page: 0, size: 200 })),
      map(result => result.content)
    );

    this.personasMap$ = this.personas$.pipe(
      map(personas =>
        personas.reduce((acc, p) => {
          const key = Number(p.IdPersona);
          acc[key] = `${p.Nombre} ${p.Apellido}`;
          return acc;
        }, {} as Record<number, string>)
      )
    );
  }

  trackSaldoCuenta = (_: number, item: SaldoCuenta) => item.IdSaldoCuenta;
  trackTipoMovimiento = (_: number, item: TipoMovimientoCxC) => item.IdTipoMovimientoCXC;

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Complete todos los campos obligatorios.');
      return;
    }

    const fechaInput = this.form.value.fechaMovimiento; // ej: '2025-10-25'
    const fechaConHora = new Date(fechaInput);

    const horaActual = new Date();
    fechaConHora.setHours(horaActual.getHours(), horaActual.getMinutes(), 0);

    const fechaISO = fechaConHora.toISOString().split('.')[0]; // elimina milisegundos


    const payload = {
      idSaldoCuenta: this.form.value.idSaldoCuenta,
      idTipoMovimientoCXC: this.form.value.idTipoMovimientoCXC,
      fechaMovimiento: fechaISO,
      valorMovimiento: this.form.value.valorMovimiento,
      descripcion: this.form.value.descripcion,
      usuarioCreacion: localStorage.getItem('username') || 'admin'
    };

    this.movSvc.registrarMovimiento(payload).subscribe(() => {
      alert('Movimiento registrado exitosamente.');
      this.form.reset();
      this.refresh$.next();
      });
    }

  cancelar() {
    this.form.reset();
  }
}
