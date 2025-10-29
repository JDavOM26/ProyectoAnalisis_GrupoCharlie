import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, startWith, switchMap, map, combineLatest } from 'rxjs';
import { PersonaService } from '../../Service/persona.service';
import { SaldoCuentaService } from '../../Service/saldo_cuenta.service';
import { Persona } from '../../Models/persona.model';
import { SaldoCuenta } from '../../Models/saldo_cuenta.model';
import { ConsultasBusquedasService } from '../../Service/consultas_busquedas.service';

@Component({
    selector: 'estado_cuenta',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './estado_cuenta.html',
    styleUrl: './estado_cuenta.css'
})
export class EstadoCuentaComponent implements OnInit {

    form!: FormGroup;
    personas$!: Observable<Persona[]>;
    personasMap$!: Observable<Record<number, string>>;
    cuentas$!: Observable<SaldoCuenta[]>;
    movimientos: any[] = [];
    modoBusqueda: 'persona' | 'cuenta' = 'persona';

    cargando = signal(false);
    totalCargos = 0;
    totalAbonos = 0;
    saldoFinal = 0;

    private readonly API_URL = 'http://localhost:8080/api/auth/obtener-movimiento-cuenta';

    constructor(
        private fb: FormBuilder,
        private personaSvc: PersonaService,
        private cuentaSvc: SaldoCuentaService,
        private consultaSvc: ConsultasBusquedasService,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            tipoBusqueda: ['persona', Validators.required],
            idPersona: [''],
            idSaldoCuenta: [''],
            anio: [new Date().getFullYear(), Validators.required],
            mes: [new Date().getMonth() + 1, Validators.required]
        });

        this.personas$ = this.personaSvc.list({ page: 0, size: 200 }).pipe(map(r => r.content));
        this.personasMap$ = this.personas$.pipe(
            map(personas =>
                personas.reduce((acc, p) => {
                    acc[p.IdPersona] = `${p.Nombre} ${p.Apellido}`;
                    return acc;
                }, {} as Record<number, string>)
            )
        );
        this.cuentas$ = this.cuentaSvc.list({ page: 0, size: 200 }).pipe(map(r => r.content));

        this.form.get('tipoBusqueda')?.valueChanges.subscribe(tipo => {
            this.modoBusqueda = tipo;
            this.movimientos = [];
            this.totalCargos = 0;
            this.totalAbonos = 0;
            this.saldoFinal = 0;
        });
    }

    private authHeaders(): HttpHeaders {
        const token = localStorage.getItem('token') || '';
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

   buscar(): void {
    this.cargando.set(true);
    this.movimientos = [];  // ← limpia antes

    const tipo = this.form.value.tipoBusqueda === 'persona' ? 'idPersona' : 'idSaldoCuenta';
    const valorBusqueda = this.form.value.tipoBusqueda === 'persona'
        ? this.form.value.idPersona
        : this.form.value.idSaldoCuenta;

    const { anio, mes } = this.form.value;
    const url = `${this.API_URL}?valorBusqueda=${valorBusqueda}&tipo=${tipo}&anio=${anio}&mes=${mes}`;

    this.http.get<any[]>(url, { headers: this.authHeaders() }).subscribe({
        next: (data) => {
            this.movimientos = Array.isArray(data) ? data : [];  // ← NUNCA NULL
            this.calcularTotales();
            this.cargando.set(false);
        },
        error: (err) => {
            console.error('Error al obtener movimientos:', err);
            this.movimientos = [];  // ← fallback seguro
            this.calcularTotales(); // ← opcional: resetear totales
            alert('No se pudieron cargar los movimientos.');
            this.cargando.set(false);
        }
    });
}

    calcularTotales() {
        this.totalCargos = this.movimientos.reduce((sum, m) => sum + (m.Cargo || 0), 0);
        this.totalAbonos = this.movimientos.reduce((sum, m) => sum + (m.Abono || 0), 0);
        if (this.movimientos.length > 0) {
            this.saldoFinal = this.movimientos[this.movimientos.length - 1].SaldoAcumulado || 0;
        }
    }

    limpiar() {
        this.form.reset({
            tipoBusqueda: 'persona',
            anio: new Date().getFullYear(),
            mes: new Date().getMonth() + 1
        });
        this.movimientos = [];
    }

    exportarPDF() {
        const tipo = this.form.value.tipoBusqueda === 'persona' ? 'idPersona' : 'idSaldoCuenta';
        const valorBusqueda = this.form.value.tipoBusqueda === 'persona'
            ? this.form.value.idPersona
            : this.form.value.idSaldoCuenta;

        const { anio, mes } = this.form.value;
        this.consultaSvc.exportarPDF(valorBusqueda, tipo, anio, mes).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'EstadoCuenta.pdf';
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => console.error('Error al exportar PDF:', err)
        });
    }

    exportarExcel() {
        const tipo = this.form.value.tipoBusqueda === 'persona' ? 'idPersona' : 'idSaldoCuenta';
        const valorBusqueda = this.form.value.tipoBusqueda === 'persona'
            ? this.form.value.idPersona
            : this.form.value.idSaldoCuenta;

        const { anio, mes } = this.form.value;
        this.consultaSvc.exportarExcel(valorBusqueda, tipo, anio, mes).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'EstadoCuenta.xlsx';
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => console.error('Error al exportar Excel:', err)
        });
    }
}
