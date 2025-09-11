import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SucursalService } from '../../Service/sucursal.service';
import { Sucursal } from '../../Models/sucursal.model';
import { Observable, BehaviorSubject, switchMap, startWith, map, combineLatest } from 'rxjs';
import { EmpresaService } from '../../Service/empresa.service';
import { Empresa } from '../../Models/empresa.model';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'sucursal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sucursal.html',
  styleUrl: './sucursal.css'
})
export class SucursalComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);
  selectedIdEmpresa = signal<string | null>(null);

  constructor(
    private fb: FormBuilder, 
    private svc: SucursalService,
    private svcEmpresa: EmpresaService,
  ) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  sucursales$!: Observable<Sucursal[]>;
  empresas$!: Observable<Empresa[]>;
  empresasMap$!: Observable<Record<string, string>>;
  vm$!: Observable<{ empresasMap: Record<number, string> }>;

  ngOnInit(): void {
    this.form = this.fb.group({
      IdSucursal: [''],
      Nombre: ['', Validators.required],
      Direccion: ['', Validators.required],
      IdEmpresa: ['',Validators.required],
      FechaCreacion: [''],
      UsuarioCreacion: [''],
      FechaModificacion: [''],
      UsuarioModificacion: [''],
      IdUsuario: ['']
    });
    
    this.sucursales$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() }))
    );
    
    this.empresas$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svcEmpresa.list({ search: this.search() }))
    );

    this.empresasMap$ = this.empresas$.pipe(
      map(empresas => 
        empresas.reduce((acc, e) => {
          const key = Number((e as any).IdEmpresa ?? (e as any).idEmpresa);
          acc[key] = (e as any).Nombre;
          return acc;
        }, {} as Record<number, string>)
      )
    );
    
    this.vm$ = combineLatest([this.empresasMap$]).pipe(
      map(([empresasMap]) => ({ empresasMap }))
    );

    this.form.disable();
  }

  trackEmpresa = (_: number, e: Empresa) => e.IdEmpresa;

  nuevo() {
    this.mode.set('crear');
    this.selectedId.set(null);
    this.selectedIdEmpresa.set(null);
    this.form.reset({
      IdSucursal: '', 
      Nombre: '', 
      Direccion: '',
      IdEmpresa: ''
    });
    this.form.enable();
  }

  ver(row: Sucursal) {
    this.mode.set('ver');
    this.selectedId.set(row.IdSucursal.toString());
    this.selectedIdEmpresa.set(row.IdEmpresa.toString());
    this.form.enable();
    this.form.patchValue(row);
    this.form.get('IdSucursal')?.disable(); // no editar llave
    this.form.get('IdEmpresa')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: Sucursal) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('IdSucursal')?.disable(); // no editar llave
    //this.form.get('IdEmpresa')?.disable(); // no editar llave
    this.selectedId.set(row.IdSucursal.toString());
    this.selectedIdEmpresa.set(row.IdEmpresa);
    this.form.patchValue(row);
    Object.keys(this.form.controls).forEach(c => { if (c !== 'IdSucursal' && c !=='IdEmpresa') this.form.get(c)?.enable(); });
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedId.set(null);
    this.selectedIdEmpresa.set(null);
    this.form.reset();
    this.form.enable();
  }

  guardar() {
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      alert('Ingrese los datos requeridos.');
      return; 
    }
    const payload: Sucursal = this.form.getRawValue();

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

  eliminar(row: Sucursal) {
    if (!confirm(`¿Eliminar Sucursal: ${row.Nombre}?`)) return;
    this.svc.delete(row.IdSucursal).subscribe(() => this.refresh$.next());
  }
}
