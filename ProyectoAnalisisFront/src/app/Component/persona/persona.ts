import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, map, startWith, switchMap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { MenuDinamicoService } from '../../Service/menu-dinamico.service';
import { Permisos } from '../../Models/menu.perm.model';
import { GeneroService } from '../../Service/genero.service';
import { Persona } from '../../Models/persona.model';
import { Genero } from '../../Models/genero.model';
import { PersonaService } from '../../Service/persona.service';
import { EstadoCivilService } from '../../Service/estadocivil.service';
import { EstadoCivil } from '../../Models/estadocivil.model';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'persona',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './persona.html',
  styleUrl: './persona.css'
})
export class PersonaComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedIdPersona = signal<number | null>(null);
  permisos: Permisos = { Alta: false, Baja: false, Cambio: false, Imprimir: false, Exportar: false };

  personas: Persona[] = [];
  totalPages = 0;
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;

  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  personas$!: Observable<Persona[]>;
  generos$!: Observable<Genero[]>;
  estadoCivil$!: Observable<EstadoCivil[]>;
  generosMap$!: Observable<Record<number, string>>;
  estadoCivilMap$!: Observable<Record<number, string>>;
  vm$!: Observable<{ personas: Persona[]; generosMap: Record<number, string>; estadoCivilMap: Record<number, string> }>;

  constructor(
    private fb: FormBuilder,
    private svc: PersonaService,
    private generoSvc: GeneroService,
    private estadoCivilSvc: EstadoCivilService,
    private menuSvc: MenuDinamicoService
  ) {}


  ngOnInit(): void {
    this.form = this.fb.group({
      IdPersona: [''],
      Nombre: ['', Validators.required],
      Apellido: ['', Validators.required],
      FechaNacimiento: ['', Validators.required],
      IdGenero: ['', Validators.required],
      Direccion: ['', Validators.required],
      Telefono: ['', Validators.required],
      IdEstadoCivil: [''],
      CorreoElectronico: ['', [Validators.required, Validators.email]],
      FechaCreacion: [''],
      UsuarioCreacion: [''],
      FechaModificacion: [''],
      UsuarioModificacion: [''],
      IdUsuario: ['']
    });

    this.loadPage(0);

    this.generos$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.generoSvc.list({ search: this.search() }))
    );

    this.generosMap$ = this.generos$.pipe(
      map(generos =>
        generos.reduce((acc, g) => {
          const key = Number((g as any).IdGenero ?? (g as any).idGenero);
          acc[key] = (g as any).Nombre ?? (g as any).nombre;
          return acc;
        }, {} as Record<number, string>)
      )
    );

    this.estadoCivil$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.estadoCivilSvc.list({ search: this.search() }))
    );

    this.estadoCivilMap$ = this.estadoCivil$.pipe(
      map(estadoCivil =>
        estadoCivil.reduce((acc, e) => {
          const key = Number((e as any).IdEstadoCivil ?? (e as any).idEstadoCivil);
          acc[key] = (e as any).Nombre ?? (e as any).nombre;
          return acc;
        }, {} as Record<number, string>)
      )
    );

    this.vm$ = combineLatest([this.personas$, this.generosMap$, this.estadoCivilMap$]).pipe(
      map(([personas, generosMap, estadoCivilMap]) => ({ personas, generosMap, estadoCivilMap }))
    );

    const pageKey = 'persona';
    this.permisos = this.menuSvc.getPermisosFromLocal(pageKey);
    if (!this.permisos || Object.values(this.permisos).every(v => !v)) {
      this.menuSvc.getPermisos(pageKey).subscribe(p => (this.permisos = p));
    }

    this.form.disable();
  }

  loadPage(page: number): void {
    this.svc.list({ page, size: this.pageSize }).subscribe({
      next: (data) => {
        this.personas = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.pageIndex = data.pageNumber;
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

  trackGenero = (_: number, item: Genero) => item.idGenero ?? item.idGenero;
  trackEstadoCivil = (_: number, item: any) => item.IdEstadoCivil ?? item.idEstadoCivil;

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  nuevo() {
    if (!this.permisos.Alta) return;
    this.mode.set('crear');
    this.form.reset();
    this.form.enable();
  }

  ver(row: Persona) {
    this.mode.set('ver');
    this.selectedIdPersona.set(row.IdPersona);
    this.form.enable();
    this.form.patchValue(row);
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: Persona) {
    if (!this.permisos.Cambio) return;
    this.mode.set('editar');
    this.selectedIdPersona.set(row.IdPersona);
    this.form.enable();
    this.form.patchValue(row);
    this.form.get('IdPersona')?.disable();
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedIdPersona.set(null);
    this.form.reset();
    this.form.disable();
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Complete todos los campos obligatorios.');
      return;
    }

    const payload: Persona = this.form.getRawValue();
    if (this.mode() === 'crear') {
      this.svc.create(payload).subscribe(() => {
        alert('Persona creada correctamente');
        this.cancelar();
        this.refresh$.next();
      });
    } else if (this.mode() === 'editar' && this.selectedIdPersona()) {
      this.svc.update(this.selectedIdPersona()!.toString(), payload).subscribe(() => {
        alert('Persona actualizada correctamente');
        this.cancelar();
        this.refresh$.next();
      });
    }
  }

  eliminar(row: Persona) {
    if (!confirm(`¿Confirma eliminar a ${row.Nombre} ${row.Apellido}?`)) return;
    if (!this.permisos.Baja) return;
    this.svc.delete(row.IdPersona.toString()).subscribe(() => this.refresh$.next());
  }
}
