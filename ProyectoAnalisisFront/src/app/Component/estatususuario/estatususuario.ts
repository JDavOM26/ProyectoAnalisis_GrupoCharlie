import { EstatususuarioService } from './../../Service/estatususuario.service';
import { EstatusUsuario } from './../../Models/estatususuario.model';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, switchMap, startWith, catchError, of } from 'rxjs';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'estatususuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estatususuario.html',
  styleUrl: './estatususuario.css'
})
export class EstatusUsuarioComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  Estatususuario$!: Observable<EstatusUsuario[]>;

  fotoFile?: File;

  constructor(private fb: FormBuilder, private svc: EstatususuarioService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idStatusUsuario: [''],
      Nombre: ['', Validators.required]
    });

    this.Estatususuario$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() })),
      catchError(err => {
        console.error('Error cargando los Estatus', err);
        return of([] as EstatusUsuario[]);
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

  ver(row: EstatusUsuario) {
    this.mode.set('ver');
    this.selectedId.set(row.idStatusUsuario!.toString());
    this.form.enable();
    this.form.patchValue({
      idStatusUsuario: row.idStatusUsuario,
      Nombre: row.nombre
    });
      //
    this.form.get('idStatusUsuario')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: EstatusUsuario) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('idStatusUsuario')?.disable(); // no editar llave
    this.selectedId.set(row.idStatusUsuario!.toString());
    this.form.patchValue({
     idStatusUsuario: row.idStatusUsuario,
      Nombre: row.nombre
    });
    Object.keys(this.form.controls).forEach(c => { if (c !== 'idStatusUsuario') this.form.get(c)?.enable(); });
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedId.set(null);
    this.form.reset();
    this.form.enable();
    this.fotoFile = undefined;
  }

  private buildCreateBody(): Partial<EstatusUsuario> {
    const v = this.form.getRawValue();
    return {
      idStatusUsuario: v.idStatusUsuario,
      nombre: v.Nombre,
    };
  }


guardar() {
  console.log(this.mode());
  console.log(this.form.value);

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  // Recuperamos el usuario del localStorage
  const usuario = localStorage.getItem('idUsuario') || 'Sistema';

  if (this.mode() === 'crear') {
    const body = {
      ...this.buildCreateBody(),
      idUsuario: usuario
    };
    console.log('CREATE body:', body);

    this.svc.create(body as EstatusUsuario).subscribe({
      next: (created) => {
        console.log('Estatus creado:', created);
        alert('¡Estatus creado correctamente!');
        this.cancelar();
        this.refresh$.next();
      },
      error: (err) => {
        console.error('Error al crear el Estatus', err);
        alert('Error al crear el Estatus. Verificar la informacion.');
      }
    });

  } else if (this.mode() === 'editar' && this.selectedId()) {
    const body = {
      ...this.buildCreateBody(),
      idUsuario: usuario
    };
    console.log('UPDATE body:', body);

    this.svc.update(this.selectedId()!, body as EstatusUsuario).subscribe({
      next: (updated) => {
        console.log('Estatus actualizada:', updated);
        alert('¡Estatus actualizado correctamente!');
        this.cancelar();
        this.refresh$.next();
      },
      error: (err) => {
        console.error('Error al actualizar el Estatus', err);
        alert('Error al actualizar el Estatus. Verificar la información.');
      }
    });
  }
}


  eliminar(row: EstatusUsuario) {
    if (!confirm(`¿Eliminar el Estatus ${row.idStatusUsuario}?`)) return;

    this.svc.delete(row.idStatusUsuario!.toString()).subscribe({
      next: (msg) => {
        console.log('Estatus eliminado:', msg);
        alert('Estatus eliminado exitosamente');
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error al eliminar el Estatus:', err);
        alert(err.error || 'Error al eliminar el Estatus');
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

