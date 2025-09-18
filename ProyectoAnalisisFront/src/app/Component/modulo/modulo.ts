import { Modulo } from '../../Models/modulo.model';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModuloService } from '../../Service/modulo.service';
import { Observable, BehaviorSubject, switchMap, startWith } from 'rxjs';
import { Permisos } from '../../Models/menu.perm.model';
import { MenuDinamicoService } from '../../Service/menu-dinamico.service';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'modulo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modulo.html',
  styleUrl: './modulo.css'
})
export class ModuloComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);
  permisos: Permisos = { Alta:false, Baja:false, Cambio:false, Imprimir:false, Exportar:false };

  constructor(
    private fb: FormBuilder, 
    private svc: ModuloService,
    private menuSvc: MenuDinamicoService,
  ) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  modulos$!: Observable<Modulo[]>;

  ngOnInit(): void {
    this.form = this.fb.group({
      IdModulo: [''],
      Nombre: ['', Validators.required],
      OrdenMenu: ['', Validators.required],
      IdUsuario: [''],
      FechaCreacion: [''],
      UsuarioCreacion: [''],
      FechaModificacion: [''],
      UsuarioModificacion: [''],
    });

    this.modulos$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() }))
    );

    const pageKey = 'modulo'; 
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
    this.form.reset({
      IdModulo: '',
      Nombre: '',
      OrdenMenu: '',
    });
    this.form.enable();
  }

  ver(row: Modulo) {
    this.mode.set('ver');
    this.selectedId.set(row.IdModulo.toString());
    this.form.enable();
    this.form.patchValue(row);
    this.form.get('IdModulo')?.disable();
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: Modulo) {
    if (!this.permisos.Cambio) return;
    this.mode.set('editar');
    this.form.enable();
    this.form.get('IdModulo')?.disable();
    this.selectedId.set(row.IdModulo.toString());
    this.form.patchValue(row);
    //Object.keys(this.form.controls).forEach(c => { if (c !== 'IdModulo') this.form.get(c)?.enable(); });
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedId.set(null);
    this.form.reset();
    this.form.disable();
  }

  guardar() {
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      alert('Ingrese los datos correctamente.');
      return; 
    }
    const payload: Modulo = this.form.getRawValue();

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

  eliminar(row: Modulo) {
    if (!this.permisos.Baja) return;
    if (!confirm(`¿Eliminar Modulo ${row.Nombre}?`)) return;
    this.svc.delete(row.IdModulo).subscribe(() => this.refresh$.next());
  }
}
