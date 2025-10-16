import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoDocumentoService } from '../../Service/tipo_documento.service';
import { tipo_documento} from '../../Models/tipo_documento.model';
import { Observable, BehaviorSubject, switchMap, startWith, map, combineLatest } from 'rxjs';
import { MenuDinamicoService } from '../../Service/menu-dinamico.service';
import { Permisos } from '../../Models/menu.perm.model';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'tipo_documento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipo_documento.html',
  styleUrl: './tipo_documento.css'
})
export class Tipoducumentocomponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);
  permisos: Permisos = { Alta:false, Baja:false, Cambio:false, Imprimir:false, Exportar:false };

  constructor(
    private fb: FormBuilder,
    private svc: TipoDocumentoService,
    private menuSvc: MenuDinamicoService,
  ) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  tiposDocumento$!: Observable<tipo_documento[]>;
  vm$!: Observable<{ empresasMap: Record<number, string> }>;

  ngOnInit(): void {
    this.form = this.fb.group({
      Nombre: ['', [Validators.required]],
      FechaCreacion: [''],
      UsuarioCreacion: [''],
      FechaModificacion: [''],
      UsuarioModificacion: [''],
      IdUsuario: ['']
    });

    this.tiposDocumento$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() }))
    );

    const pageKey = 'tipo_documento';
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
      IdTipoDocumento: '',
      Nombre: '',
    });
    this.form.enable();
  }

  ver(row: tipo_documento) {
    this.mode.set('ver');
    this.selectedId.set(row.IdTipoDocumento.toString());
    this.form.enable();
    this.form.patchValue(row);
    this.form.get('IdTipoDocumento')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: tipo_documento) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('IdTipoDocumento')?.disable(); // no editar llave
    //this.form.get('IdEmpresa')?.disable(); // no editar llave
    this.selectedId.set(row.IdTipoDocumento.toString());
    this.form.patchValue(row);
    Object.keys(this.form.controls).forEach(c => { if (c !== 'IdTipoDocumento') this.form.get(c)?.enable(); });
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
    const payload: tipo_documento = this.form.getRawValue();

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

  eliminar(row: tipo_documento) {
    if (!confirm(`¿Eliminar Tipo documento: ${row.Nombre}?`)) return;
    this.svc.delete(row.IdTipoDocumento).subscribe(() => this.refresh$.next());
  }
}
