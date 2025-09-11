import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpresaService } from '../../Service/empresa.service';
import { Empresa } from '../../Models/empresa.model';
import { Observable, BehaviorSubject, switchMap, startWith, catchError, of } from 'rxjs';

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

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  Empresas$!: Observable<Empresa[]>;
  
  fotoFile?: File;
  
  constructor(private fb: FormBuilder, private svc: EmpresaService) {}

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
    this.form.get('idEmpresa')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable()); 
  }

  editar(row: Empresa) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('idEmpresa')?.disable(); // no editar llave
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
    this.fotoFile = undefined;
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
    console.log(this.mode());
    console.log(this.form.value);
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      alert('Ingrese la informacion requerida.');
      return; 
    }

    if (this.mode() === 'crear') {
      const body = this.buildCreateBody();
      console.log(body);
      this.svc.create(body as Empresa).subscribe({
        next: (created) => {
          console.log('Empresa creada:', created);
          alert('¡Empresa creada correctamente!');
          this.cancelar();
          this.refresh$.next();
        },
        error: (err) => {
          console.error('Error al crear empresa', err);
          alert('Error al crear empresa. Verificar la informacion.');
        }
      });

    } else if (this.mode() === 'editar' && this.selectedId()) {
      const body = this.buildCreateBody();
      console.log('UPDATE body:', body);
      this.svc.update(body as Empresa).subscribe({
        next: (updated) => {
          console.log('Empresa actualizada:', updated);
          alert('¡Empresa actualizada correctamente!');
          this.cancelar();
          this.refresh$.next();
        },
        error: (err) => {
          console.error('Error al actualizar empresa', err);
          alert('Error al actualizar empresa. Verificar la información.');
        }
      });
    }
  }

  eliminar(row: Empresa) {
    if (!confirm(`¿Eliminar empresa ${row.Nombre}?`)) return;

    this.svc.delete(row.IdEmpresa.toString()).subscribe({
      next: (msg) => {
        console.log('Empresa eliminada:', msg);
        alert('Empresa eliminada exitosamente');
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error al eliminar empresa:', err);
        alert(err.error || 'Error al eliminar la empresa');
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
