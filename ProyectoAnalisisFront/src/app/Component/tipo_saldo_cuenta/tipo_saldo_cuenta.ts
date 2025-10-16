import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, switchMap, startWith, map, combineLatest } from 'rxjs';
import { MenuDinamicoService } from '../../Service/menu-dinamico.service';
import { Permisos } from '../../Models/menu.perm.model';
import { TipoSaldoCuentaService } from '../../Service/tipo_saldo_cuenta.service';
import { TipoSaldoCuenta } from '../../Models/tipo_saldo_cuenta.model';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'tipo_saldo_cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipo_saldo_cuenta.html',
  styleUrl: './tipo_saldo_cuenta.css'
})
export class TipoSaldoCuentaComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);
  permisos: Permisos = { Alta:false, Baja:false, Cambio:false, Imprimir:false, Exportar:false };

  constructor(
    private fb: FormBuilder, 
    private svc: TipoSaldoCuentaService,
    private menuSvc: MenuDinamicoService,
  ) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  tiposaldocuenta$!: Observable<TipoSaldoCuenta[]>;

  ngOnInit(): void {
    this.form = this.fb.group({
      IdTipoSaldoCuenta: [''],
      Nombre: ['', Validators.required],
      FechaCreacion: [''],
      UsuarioCreacion: [''],
      FechaModificacion: [''],
      UsuarioModificacion: [''],
      IdUsuario: ['']
    });
    
    this.tiposaldocuenta$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() }))
    );
    
    const pageKey = 'tipo_saldo_cuenta'; 
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
      IdTipoSaldoCuenta: '', 
      Nombre: '', 
      Direccion: '',
      IdEmpresa: ''
    });
    this.form.enable();
  }

  ver(row: TipoSaldoCuenta) {
    this.mode.set('ver');
    this.selectedId.set(row.IdTipoSaldoCuenta.toString());
    this.form.enable();
    this.form.patchValue(row);
    this.form.get('IdTipoSaldoCuenta')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: TipoSaldoCuenta) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('IdTipoSaldoCuenta')?.disable(); // no editar llave
    this.selectedId.set(row.IdTipoSaldoCuenta.toString());
    this.form.patchValue(row);
    Object.keys(this.form.controls).forEach(c => { if (c !== 'IdTipoSaldoCuenta') this.form.get(c)?.enable(); });
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
    const payload: TipoSaldoCuenta = this.form.getRawValue();

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

  eliminar(row: TipoSaldoCuenta) {
    if (!confirm(`¿Eliminar Tipo de Saldo de la Cuenta: ${row.Nombre}?`)) return;
    this.svc.delete(row.IdTipoSaldoCuenta).subscribe(() => this.refresh$.next());
  }
}
