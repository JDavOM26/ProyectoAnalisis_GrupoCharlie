import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, switchMap, startWith, map, combineLatest } from 'rxjs';
import { MenuDinamicoService } from '../../Service/menu-dinamico.service';
import { Permisos } from '../../Models/menu.perm.model';
import { TipoMovimientoCxCService } from '../../Service/tipo_mov_cxc.service';
import { TipoMovimientoCxC } from '../../Models/tipo_movimiento_cxc.model';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'tipo_movimiento_cxc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipo_movimiento_cxc.html',
  styleUrl: './tipo_movimiento_cxc.css'
})
export class TipoMovimientoCxCComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);
  permisos: Permisos = { Alta:false, Baja:false, Cambio:false, Imprimir:false, Exportar:false };

  constructor(
    private fb: FormBuilder, 
    private svc: TipoMovimientoCxCService,
    private menuSvc: MenuDinamicoService,
  ) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  tipomovcxc$!: Observable<TipoMovimientoCxC[]>;

  ngOnInit(): void {
    this.form = this.fb.group({
      IdTipoMovimientoCXC: [''],
      Nombre: ['', Validators.required],
      OperacionCuentaCorriente: ['', Validators.required],
      FechaCreacion: [''],
      UsuarioCreacion: [''],
      FechaModificacion: [''],
      UsuarioModificacion: [''],
      IdUsuario: ['']
    });
    
    this.tipomovcxc$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() }))
    );
    
    const pageKey = 'tipo_movimiento_cxc'; 
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
      IdTipoMovimientoCXC: '', 
      Nombre: '', 
      Direccion: '',
      IdEmpresa: ''
    });
    this.form.enable();
  }

  ver(row: TipoMovimientoCxC) {
    this.mode.set('ver');
    this.selectedId.set(row.IdTipoMovimientoCXC.toString());
    this.form.enable();
    this.form.patchValue(row);
    this.form.get('IdTipoMovimientoCXC')?.disable(); // no editar llave
    this.form.get('IdEmpresa')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: TipoMovimientoCxC) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('IdTipoMovimientoCXC')?.disable(); // no editar llave
    //this.form.get('IdEmpresa')?.disable(); // no editar llave
    this.selectedId.set(row.IdTipoMovimientoCXC.toString());
    this.form.patchValue(row);
    Object.keys(this.form.controls).forEach(c => { if (c !== 'IdTipoMovimientoCXC' && c !=='IdEmpresa') this.form.get(c)?.enable(); });
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
    const payload: TipoMovimientoCxC = this.form.getRawValue();

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

  eliminar(row: TipoMovimientoCxC) {
    if (!confirm(`¿Eliminar TipoMovimientoCxC: ${row.Nombre}?`)) return;
    this.svc.delete(row.IdTipoMovimientoCXC).subscribe(() => this.refresh$.next());
  }
}
