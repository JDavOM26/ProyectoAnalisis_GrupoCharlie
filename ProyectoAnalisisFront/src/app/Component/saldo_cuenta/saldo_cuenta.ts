import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, map, startWith, switchMap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { MenuDinamicoService } from '../../Service/menu-dinamico.service';
import { Permisos } from '../../Models/menu.perm.model';
import { Persona } from '../../Models/persona.model';
import { TipoSaldoCuenta } from '../../Models/tipo_saldo_cuenta.model';
import { PersonaService } from '../../Service/persona.service';
import { SaldoCuentaService } from '../../Service/saldo_cuenta.service';
import { TipoSaldoCuentaService } from '../../Service/tipo_saldo_cuenta.service';
import { SaldoCuenta } from '../../Models/saldo_cuenta.model';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'saldo_cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './saldo_cuenta.html',
  styleUrl: './saldo_cuenta.css'
})
export class SaldoCuentaComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedIdSaldoCuenta = signal<number | null>(null);
  permisos: Permisos = { Alta: false, Baja: false, Cambio: false, Imprimir: false, Exportar: false };

  // ===== Datos y paginación =====
  saldoCuenta: SaldoCuenta[] = [];
  saldoCuentaFiltered: SaldoCuenta[] = [];
  totalPages = 0;
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;

  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');

  personas$!: Observable<Persona[]>;
  tipoSaldoCuenta$!: Observable<TipoSaldoCuenta[]>;
  personasMap$!: Observable<Record<number, string>>;
  tipoSaldoCuentaMap$!: Observable<Record<number, string>>;
  vm$!: Observable<{ personasMap: Record<number, string>; tipoSaldoCuentaMap: Record<number, string> }>;

  constructor(
    private fb: FormBuilder,
    private svc: SaldoCuentaService,
    private personaSvc: PersonaService,
    private tipoSaldoCuentaSvc: TipoSaldoCuentaService,
    private menuSvc: MenuDinamicoService
  ) {}




  ngOnInit(): void {
    // ===== FORMULARIO =====
    this.form = this.fb.group({
      IdPersona: ['', Validators.required],
      IdStatusCuenta: ['', Validators.required],
      IdTipoSaldoCuenta: ['', Validators.required],
      SaldoAnterior: [''],
      Debitos: [''],
      Creditos: [''],
      FechaCreacion: [''],
      UsuarioCreacion: [''],
      FechaModificacion: [''],
      UsuarioModificacion: [''],
      IdUsuario: ['']
    });

    // ===== Cargar primera página =====
    this.loadPage(0);

    // ===== Cargar personas =====
    this.personas$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.personaSvc.list({ page: 0, size: 100 })),
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

    // ===== Cargar tipos de saldo =====
    this.tipoSaldoCuenta$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.tipoSaldoCuentaSvc.list({ search: this.search() }))
    );

    this.tipoSaldoCuentaMap$ = this.tipoSaldoCuenta$.pipe(
      map(tipoSaldoCuenta =>
        tipoSaldoCuenta.reduce((acc, t) => {
          const key = Number(t.IdTipoSaldoCuenta);
          acc[key] = t.Nombre;
          return acc;
        }, {} as Record<number, string>)
      )
    );

    // ===== Vista combinada =====
    this.vm$ = combineLatest([this.personasMap$, this.tipoSaldoCuentaMap$]).pipe(
      map(([personasMap, tipoSaldoCuentaMap]) => ({ personasMap, tipoSaldoCuentaMap }))
    );

    // ===== Permisos =====
    const pageKey = 'saldo_cuenta';
    this.permisos = this.menuSvc.getPermisosFromLocal(pageKey);
    if (!this.permisos || Object.values(this.permisos).every(v => !v)) {
      this.menuSvc.getPermisos(pageKey).subscribe(p => (this.permisos = p));
    }

    this.form.disable();
  }

  onSearchChange(event: any): void {
    const term = event.target.value.toLowerCase().trim() || '';

    if (!term) {
      this.saldoCuentaFiltered = [...this.saldoCuenta];
      return;
    }

    this.vm$.subscribe(vm => {
      this.saldoCuentaFiltered = this.saldoCuenta.filter(s => {
        const nombre = vm.personasMap[s.IdPersona]?.toLowerCase() || '';
        return nombre.includes(term);
      });
    });
  }

  trackPersona = (_: number, item: Persona) => item.IdPersona ?? item.IdPersona; 
  trackTipoSaldoCuenta = (_: number, item: TipoSaldoCuenta) => item.IdTipoSaldoCuenta ?? item.IdTipoSaldoCuenta;

  // ===== Cargar página =====
  loadPage(page: number): void {
    this.svc.list({ page, size: this.pageSize }).subscribe({
      next: (data) => {
        this.saldoCuenta = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.pageIndex = data.pageNumber;
        this.saldoCuentaFiltered = [...this.saldoCuenta];
      },
      error: (err) => console.error('Error cargando página:', err)
    });
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.loadPage(this.pageIndex + 1);
    }
  }

  prevPage(): void {
    if (this.pageIndex > 0) {
      this.loadPage(this.pageIndex - 1);
    }
  }

  // ===== CRUD =====
  nuevo() {
    if (!this.permisos.Alta) return;
    this.mode.set('crear');
    this.form.reset();
    this.form.enable();
  }

  ver(row: SaldoCuenta) {
    this.mode.set('ver');
    this.selectedIdSaldoCuenta.set(row.IdSaldoCuenta);
    this.form.enable();
    this.form.patchValue(row);
    this.form.get('IdSaldoCuenta')?.disable();
    this.form.get('IdPersona')?.disable();
    this.form.get('IdStatusCuenta')?.disable();
    this.form.get('IdTipoSaldoCuenta')?.disable();
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: SaldoCuenta) {
    if (!this.permisos.Cambio) return;
    this.mode.set('editar');
    this.selectedIdSaldoCuenta.set(row.IdSaldoCuenta);
    this.form.enable();
    this.form.patchValue(row);
    this.form.get('IdSaldoCuenta')?.disable();
    this.form.get('IdPersona')?.disable();
    this.form.get('IdStatusCuenta')?.disable();
    this.form.get('IdTipoSaldoCuenta')?.disable();
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedIdSaldoCuenta.set(null);
    this.form.reset();
    this.form.disable();
  }

  guardar() {
    if (this.form.invalid) {
      alert('Complete todos los campos obligatorios.');
      return;
    }

    const payload: SaldoCuenta = this.form.getRawValue();

    if (this.mode() === 'crear') {
      this.svc.create(payload).subscribe(() => {
        alert('Saldo de la cuenta creado correctamente.');
        this.cancelar();
        this.loadPage(this.pageIndex);
      });
    } else if (this.mode() === 'editar' && this.selectedIdSaldoCuenta()) {
      this.svc.update(this.selectedIdSaldoCuenta()!.toString(), payload).subscribe(() => {
        alert('Saldo de la cuenta actualizado correctamente.');
        this.cancelar();
        this.loadPage(this.pageIndex);
      });
    }
  }

  eliminar(row: SaldoCuenta, personaNombre: string) {
    if (!confirm(`¿Confirma eliminar el saldo de ${personaNombre}?`)) return;
    if (!this.permisos.Baja) return;
    this.svc.delete(row.IdSaldoCuenta.toString()).subscribe(() => this.loadPage(this.pageIndex));
  }
}
