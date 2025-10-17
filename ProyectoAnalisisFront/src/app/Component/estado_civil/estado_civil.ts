import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadoCivil } from '../../Models/estadocivil.model';
import { EstadoCivilService } from '../../Service/estadocivil.service';
import { Observable, BehaviorSubject, switchMap, startWith, map, combineLatest } from 'rxjs';
import { MenuDinamicoService } from '../../Service/menu-dinamico.service';
import { Permisos } from '../../Models/menu.perm.model';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'estado_civil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estado_civil.html',
  styleUrl: './estado_civil.css'
})
export class estadocivilComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);
  permisos: Permisos = { Alta:false, Baja:false, Cambio:false, Imprimir:false, Exportar:false };

  constructor(
    private fb: FormBuilder,
    private svc: EstadoCivilService,
    private menuSvc: MenuDinamicoService,
  ) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  estadosCiviles$!: Observable<EstadoCivil[]>;
  vm$!: Observable<{ empresasMap: Record<number, string> }>;

  ngOnInit(): void {
    this.form = this.fb.group({
      IdEstadoCivil: [''],
      Nombre: ['', [Validators.required]],
      FechaCreacion: [''],
      UsuarioCreacion: [''],
      FechaModificacion: [''],
      UsuarioModificacion: [''],
      IdUsuario: ['']
    });

    this.estadosCiviles$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() }))
    );

    const pageKey = 'estado_civil';
    this.permisos = this.menuSvc.getPermisosFromLocal(pageKey);
    console.log('Permisos desde localStorage:', this.permisos);

    if (!this.permisos || Object.values(this.permisos).every(v => v === false)) {
      this.menuSvc.getPermisos(pageKey).subscribe(p => {
        this.permisos = p;
        console.log('Permisos desde backend:', p);
      });
    }

    this.form.disable();
  }

  nuevo() {
    this.mode.set('crear');
    this.selectedId.set(null);
    this.form.reset({
      IdEstadoCivil: '',
      Nombre: ''
    });
    this.form.enable();
  }

  ver(row: EstadoCivil) {
    this.mode.set('ver');
    this.selectedId.set(row.IdEstadoCivil.toString());
    this.form.enable();
    this.form.patchValue(row);
    this.form.get('IdEstadoCivil')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: EstadoCivil) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('IdEstadoCivil')?.disable(); // no editar llave
    this.selectedId.set(row.IdEstadoCivil.toString());
    this.form.patchValue(row);
    Object.keys(this.form.controls).forEach(c => { if (c !== 'IdEstadoCivil') this.form.get(c)?.enable(); });
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedId.set(null);
    this.form.reset();
    this.form.enable();
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Ingrese los datos requeridos.');
      return;
    }
    const payload: EstadoCivil = this.form.getRawValue();

    if (this.mode() === 'crear') {
      this.svc.create(payload).subscribe(() => {
        this.cancelar(); this.refresh$.next();
      });
    } else if (this.mode() === 'editar' && this.selectedId()) {
      this.svc.update(this.selectedId()!, payload).subscribe(() => {
        this.cancelar(); this.refresh$.next();
      });
    }
  }

  eliminar(row: EstadoCivil) {
    if (!confirm(`¿Eliminar el estado civil: ${row.Nombre}?`)) return;
    this.svc.delete(row.IdEstadoCivil).subscribe(() => this.refresh$.next());
  }
}
