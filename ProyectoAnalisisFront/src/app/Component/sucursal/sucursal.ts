import { EmpresaService } from './../../Service/empresa.service';
import { Empresa } from './../../Models/empresa.model';
import { Sucursal } from './../../Models/sucursal.model';
import { SucursalService } from './../../Service/sucursal.service';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, switchMap, startWith, catchError, of } from 'rxjs';

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

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  sucursales$!: Observable<Sucursal[]>;
   Empresas$!: Observable<Empresa[]>;
  fotoFile?: File;

  constructor(private fb: FormBuilder, private svc: SucursalService, private empresaSvc: EmpresaService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idSucursal: [''],
      Nombre: ['', Validators.required],
      Direccion: ['', Validators.required],
      idEmpresa: ['', Validators.required]
    });

    this.sucursales$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() })),
      catchError(err => {
        console.error('Error cargando las sucursales', err);
        return of([] as Sucursal[]);
      })
    );
    this.Empresas$ = this.empresaSvc.list();
    this.form.disable();
  }

  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length) this.fotoFile = input.files[0];
  }

  nuevo() {
    this.mode.set('crear');
    this.selectedId.set(null);
    this.form.reset();
    this.form.enable();
  }

  ver(row: Sucursal) {
    this.mode.set('ver');
    this.selectedId.set(row.idSucursal!.toString());
    this.form.enable();
    this.form.patchValue({
      idSucursal: row.idSucursal,
      Nombre: row.nombre,
      Direccion: row.direccion,
      idEmpresa: row.idEmpresa
    });
      //
    this.form.get('idSucursal')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: Sucursal) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('idSucursal')?.disable(); // no editar llave
    this.selectedId.set(row.idSucursal!.toString());
    this.form.patchValue({
      idSucursal: row.idSucursal,
      Nombre: row.nombre,
      Direccion: row.direccion,
      idEmpresa: row.idEmpresa
    });
    Object.keys(this.form.controls).forEach(c => { if (c !== 'idSucursal') this.form.get(c)?.enable(); });
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedId.set(null);
    this.form.reset();
    this.form.enable();
    this.fotoFile = undefined;
  }

  private buildCreateBody(): Partial<Sucursal> {
    const v = this.form.getRawValue();
    return {
      idSucursal: v.idSucursal,
      nombre: v.Nombre,
      direccion: v.Direccion,
      idEmpresa: v.idEmpresa
    };
  }


guardar() {
  console.log(this.mode());
  console.log(this.form.value);
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  if (this.mode() === 'crear') {
      const body = this.buildCreateBody();
      console.log(body);
      this.svc.create(body as Sucursal).subscribe({
        next: (created) => {
          console.log('Sucursak creada:', created);
          alert('¡Sucursal creada correctamente!');
          this.cancelar();
          this.refresh$.next();
        },
        error: (err) => {
          console.error('Error al crear la sucursal', err);
          alert('Error al crear sucursal. Verificar la informacion.');
        }
      });
} else if (this.mode() === 'editar' && this.selectedId()) {
      const body = this.buildCreateBody();
      console.log('UPDATE body:', body);
      this.svc.update(body as Sucursal).subscribe({
        next: (updated) => {
          console.log('Sucursal actualizada:', updated);
          alert('¡Sucursal actualizada correctamente!');
          this.cancelar();
          this.refresh$.next();
        },
        error: (err) => {
          console.error('Error al actualizar sucursal', err);
          alert('Error al actualizar el sucursal. Verificar la información.');
        }
      });
}
}
  eliminar(row: Sucursal) {
    if (!confirm(`¿Eliminar el sucursal ${row.idSucursal}?`)) return;

    this.svc.delete(row.idSucursal!.toString()).subscribe({
      next: (msg) => {
        console.log('Sucursal eliminado:', msg);
        alert('Sucursal eliminado exitosamente');
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error al eliminar sucursal:', err);
        alert(err.error || 'Error al eliminar el sucursal');
      }
    });
  }

  private formatDate(date: any): string | null {
  if (!date) return null;

  // Si ya es string (por ejemplo "2025-08-27"), devolverlo tal cual
  if (typeof date === 'string') return date.substring(0, 10);

  // Si es un objeto Date
  const d = new Date(date);
  return d.toISOString().substring(0, 10); // "YYYY-MM-DD"
}
}
