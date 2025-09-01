import { RoleOpcion } from '../../Models/role-opcion.model';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { combineLatest, map, Observable, BehaviorSubject, switchMap, startWith } from 'rxjs';
import { RoleOpcionService } from '../../Service/role-opcion.service';
import { Rol } from '../../Models/rol.model';
import { RolService } from '../../Service/rol.service';
import { Opcion } from '../../Models/opcion.model';
import { OpcionService } from '../../Service/opcion.service';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'role-opcion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role-opcion.html',
  styleUrl: './role-opcion.css'
})
export class RoleOpcionComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedIdRole = signal<string | null>(null);
  selectedIdOpcion = signal<string | null>(null);

  constructor(
    private fb: FormBuilder, 
    private svc: RoleOpcionService,
    private svcRol: RolService,
    private svcOpcion: OpcionService, 
  ) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  roleOpcion$!: Observable<RoleOpcion[]>;
  roles$!: Observable<Rol[]>;
  rolesMap$!: Observable<Record<string, string>>;
  opciones$!: Observable<Opcion[]>;
  opcionesMap$!: Observable<Record<string, string>>;

  vm$!: Observable<{rolesMap: Record<number,string>, opcionesMap: Record<number,string>}>;


  ngOnInit(): void {
    this.form = this.fb.group({
      IdRole: ['', Validators.required],
      IdOpcion: ['', Validators.required],
      Alta: [false, Validators.required],
      Baja: [false, Validators.required],
      Cambio: [false, Validators.required],
      Imprimir: [false, Validators.required],
      Exportar: [false, Validators.required],
      FechaCreacion: [''],
      UsuarioCreacion: [''],
      FechaModificacion: [''],
      UsuarioModificacion: [''],
      IdUsuario: ['']
    });

    this.roleOpcion$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() }))
    );

    this.roles$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svcRol.list({ search: this.search() }))
    );

    this.rolesMap$ = this.roles$.pipe(
      map(roles =>
        roles.reduce((acc, r) => {
          const key = Number((r as any).IdRol ?? (r as any).IdRole ?? (r as any).idRol);
          acc[key] = (r as any).Nombre;
          return acc;
        }, {} as Record<number, string>)
      )
    );

    this.opciones$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svcOpcion.list({ search: this.search() }))
    );

    this.opcionesMap$ = this.opciones$.pipe(
      map(opciones =>
        opciones.reduce((acc, r) => {
          const key = Number((r as any).IdOpcion ?? (r as any).IdOpcion ?? (r as any).idOpcion);
          acc[key] = (r as any).Nombre;
          return acc;
        }, {} as Record<number, string>)
      )
    );

    this.vm$ = combineLatest([this.rolesMap$, this.opcionesMap$]).pipe(
      map(([rolesMap, opcionesMap]) => ({ rolesMap, opcionesMap }))
    );

    this.form.disable();
  }

  trackRol      = (_: number, r: Rol) => r.idRole;
  trackOpcion   = (_: number, o: Opcion) => o.IdOpcion;

  nuevo() {
    this.mode.set('crear');
    this.selectedIdRole.set(null);
    this.form.reset({
      IdRol: '',
      IdOpcion: '',
      Alta: false,
      Baja: false,
      Cambio: false,
      Imprimir: false,
      Exportar: false
    });
    this.form.enable();
  }

  ver(row: RoleOpcion) {
    this.mode.set('ver');
    this.selectedIdRole.set(row.IdRole.toString());
    this.selectedIdOpcion.set(row.IdOpcion.toString());
    this.form.enable();
    this.form.patchValue(row);
    this.form.get('IdRole')?.disable(); // no editar llave
    this.form.get('IdOpcion')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: RoleOpcion) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('IdRole')?.disable(); // no editar llave
    this.form.get('IdOpcion')?.disable(); // no editar llave
    this.selectedIdRole.set(row.IdRole.toString());
    this.selectedIdOpcion.set(row.IdOpcion.toString());
    this.form.patchValue(row);
    Object.keys(this.form.controls).forEach(c => { if (c !== 'IdRole' && c !== 'IdOpcion') this.form.get(c)?.enable(); });
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedIdRole.set(null);
    this.selectedIdOpcion.set(null);
    this.form.reset();
    this.form.disable();
  }

  guardar() {
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      alert('Formulario inválido');
      return; 
    }
    const payload: RoleOpcion = this.form.getRawValue();

    if (this.mode() === 'crear') {
      this.svc.create(payload).subscribe(() => {
        this.cancelar(); this.refresh$.next();
      });
    } else if (this.mode() === 'editar' && this.selectedIdRole()) {
      this.svc.update(payload).subscribe(() => {
        this.cancelar(); this.refresh$.next();
      });
    }
  }

  eliminar(row: RoleOpcion) {
    if (!confirm(`¿Eliminar Rol ${row.IdRole}?`)) return;
    this.svc.delete(row.IdRole,row.IdOpcion).subscribe(() => {
        this.cancelar(); this.refresh$.next(); this.ngOnInit();
      });
  }
}
