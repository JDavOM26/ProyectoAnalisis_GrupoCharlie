import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpresaService } from '../../Service/empresa.service';
import { Empresa } from '../../Models/empresa.model';
import { Permisos } from '../../Models/menu.perm.model';
import { Observable, BehaviorSubject, switchMap, startWith, catchError, of } from 'rxjs';
import { MenuDinamicoService } from '../../Service/menu-dinamico.service';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empresa.html',
  styleUrl: './empresa.css'
})
export class EmpresaComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);

  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');

  Empresas$!: Observable<Empresa[]>;
  permisos: Permisos = { Alta:false, Baja:false, Cambio:false, Imprimir:false, Exportar:false };

  constructor(
    private fb: FormBuilder,
    private svc: EmpresaService,
    private menuSvc: MenuDinamicoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idEmpresa: [''],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      nit: ['', Validators.required],
      passwordCantidadMayusculas: ['', Validators.required],
      passwordCantidadMinusculas: ['', Validators.required],
      passwordCantidadCaracteresEspeciales: ['', Validators.required],
      passwordCantidadCaducidadDias: ['', Validators.required],
      passwordLargo: ['', Validators.required],
      passwordIntentosAntesDeBloquear: ['', Validators.required],
      passwordCantidadNumeros: ['', Validators.required],
      passwordCantidadPreguntasValidar: ['', Validators.required]
    });

    this.Empresas$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() })),
      catchError(err => {
        console.error('Error cargando empresas', err);
        return of([] as Empresa[]);
      })
    );

    const pageKey = 'empresas'; 
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
    if (!this.permisos.Alta) return;
    this.mode.set('crear');
    this.selectedId.set(null);
    this.form.reset();
    this.form.enable();
  }

  ver(row: Empresa) {
    this.mode.set('ver');
    this.selectedId.set(row.IdEmpresa.toString());
    this.form.enable();
    this.form.patchValue({
      idEmpresa: row.IdEmpresa,
      nombre: row.Nombre,
      direccion: row.Direccion,
      nit: row.Nit,
      passwordCantidadMayusculas: row.PasswordCantidadMayusculas,
      passwordCantidadMinusculas: row.PasswordCantidadMinusculas,
      passwordCantidadCaracteresEspeciales: row.PasswordCantidadCaracteresEspeciales,
      passwordCantidadCaducidadDias: row.PasswordCantidadCaducidadDias,
      passwordLargo: row.PasswordLargo,
      passwordIntentosAntesDeBloquear: row.PasswordIntentosAntesDeBloquear,
      passwordCantidadNumeros: row.PasswordCantidadNumeros,
      passwordCantidadPreguntasValidar: row.PasswordCantidadPreguntasValidar
    });
    this.form.get('idEmpresa')?.disable();
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: Empresa) {
    if (!this.permisos.Cambio) return;
    this.mode.set('editar');
    this.form.enable();
    this.form.get('idEmpresa')?.disable();
    this.selectedId.set(row.IdEmpresa.toString());
    this.form.patchValue({
      idEmpresa: row.IdEmpresa,
      nombre: row.Nombre,
      direccion: row.Direccion,
      nit: row.Nit,
      passwordCantidadMinusculas: row.PasswordCantidadMinusculas,
      passwordCantidadMayusculas: row.PasswordCantidadMayusculas,
      passwordCantidadCaracteresEspeciales: row.PasswordCantidadCaracteresEspeciales,
      passwordCantidadCaducidadDias: row.PasswordCantidadCaducidadDias,
      passwordLargo: row.PasswordLargo,
      passwordIntentosAntesDeBloquear: row.PasswordIntentosAntesDeBloquear,
      passwordCantidadNumeros: row.PasswordCantidadNumeros,
      passwordCantidadPreguntasValidar: row.PasswordCantidadPreguntasValidar
    });
    Object.keys(this.form.controls).forEach(c => { if (c !== 'idEmpresa') this.form.get(c)?.enable(); });
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedId.set(null);
    this.form.reset();
    this.form.disable();
  }

  private buildCreateBody(): Partial<Empresa> {
    const v = this.form.getRawValue();
    return {
      IdEmpresa: v.idEmpresa,
      Nombre: v.nombre,
      Direccion: v.direccion,
      Nit: v.nit,
      PasswordCantidadMayusculas: +v.passwordCantidadMayusculas,
      PasswordCantidadMinusculas: +v.passwordCantidadMinusculas,
      PasswordCantidadCaracteresEspeciales: +v.passwordCantidadCaracteresEspeciales,
      PasswordCantidadCaducidadDias: +v.passwordCantidadCaducidadDias,
      PasswordLargo: +v.passwordLargo,
      PasswordIntentosAntesDeBloquear: +v.passwordIntentosAntesDeBloquear,
      PasswordCantidadNumeros: +v.passwordCantidadNumeros,
      PasswordCantidadPreguntasValidar: +v.passwordCantidadPreguntasValidar
    };
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Ingrese la informacion requerida.');
      return;
    }

    if (this.permisos.Alta && this.mode() === 'crear') {
      const body = this.buildCreateBody();
      this.svc.create(body as Empresa).subscribe({
        next: () => { alert('¡Empresa creada correctamente!'); this.cancelar(); this.refresh$.next(); },
        error: (err) => { console.error('Error al crear empresa', err); alert('Error al crear empresa.'); }
      });

    } else if (this.permisos.Cambio && this.mode() === 'editar' && this.selectedId()) {
      const body = this.buildCreateBody();
      this.svc.update(body as Empresa).subscribe({
        next: () => { alert('¡Empresa actualizada correctamente!'); this.cancelar(); this.refresh$.next(); },
        error: (err) => { console.error('Error al actualizar empresa', err); alert('Error al actualizar empresa.'); }
      });
    }
  }

  eliminar(row: Empresa) {
    if (!this.permisos.Baja) return;
    if (!confirm(`¿Eliminar empresa ${row.Nombre}?`)) return;

    this.svc.delete(row.IdEmpresa.toString()).subscribe({
      next: () => { alert('Empresa eliminada exitosamente'); this.refresh$.next(); this.cancelar(); },
      error: (err) => { console.error('Error al eliminar empresa:', err); alert(err.error || 'Error al eliminar la empresa'); }
    });
  }

  private formatDate(date: any): string | null {
    if (!date) return null;
    if (typeof date === 'string') return date.substring(0, 10);
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }
}
