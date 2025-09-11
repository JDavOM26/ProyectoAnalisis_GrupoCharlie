import { Genero } from './../../Models/genero.model';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneroService } from '../../Service/genero.service';
import { Observable, BehaviorSubject, switchMap, startWith, catchError, of } from 'rxjs';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'genero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './genero.html',
  styleUrl: './genero.css'
})
export class GenerocComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  generos$!: Observable<Genero[]>;

  fotoFile?: File;

  constructor(private fb: FormBuilder, private svc: GeneroService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idGenero: [''],
      Nombre: ['', Validators.required]
    });

    this.generos$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() })),
      catchError(err => {
        console.error('Error cargando los generos', err);
        return of([] as Genero[]);
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

  ver(row: Genero) {
    this.mode.set('ver');
    this.selectedId.set(row.idGenero!.toString());
    this.form.enable();
    this.form.patchValue({
      idGenero: row.idGenero,
      Nombre: row.nombre
    });
      //
    this.form.get('idGenero')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: Genero) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('idGenero')?.disable(); // no editar llave
    this.selectedId.set(row.idGenero!.toString());
    this.form.patchValue({
      idGenero: row.idGenero,
      Nombre: row.nombre
    });
    Object.keys(this.form.controls).forEach(c => { if (c !== 'idGenero') this.form.get(c)?.enable(); });
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedId.set(null);
    this.form.reset();
    this.form.enable();
    this.fotoFile = undefined;
  }

  private buildCreateBody(): Partial<Genero> {
    const v = this.form.getRawValue();
    return {
      idGenero: v.idGenero,
      nombre: v.Nombre
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
      idUsuario: usuario   // 👈 aquí va el usuario
    };
    console.log('CREATE body:', body);

    this.svc.create(body as Genero).subscribe({
      next: (created) => {
        console.log('Genero creada:', created);
        alert('¡Genero creada correctamente!');
        this.cancelar();
        this.refresh$.next();
      },
      error: (err) => {
        console.error('Error al crear el genero', err);
        alert('Error al crear el genero. Verificar la informacion.');
      }
    });

  } else if (this.mode() === 'editar' && this.selectedId()) {
    const body = {
      ...this.buildCreateBody(),
      idUsuario: usuario   // 👈 igual para editar
    };
    console.log('UPDATE body:', body);

    this.svc.update(this.selectedId()!, body as Genero).subscribe({
      next: (updated) => {
        console.log('Genero actualizada:', updated);
        alert('¡Genero actualizado correctamente!');
        this.cancelar();
        this.refresh$.next();
      },
      error: (err) => {
        console.error('Error al actualizar el genero', err);
        alert('Error al actualizar el genero. Verificar la información.');
      }
    });
  }
}


  eliminar(row: Genero) {
    if (!confirm(`¿Eliminar el genero ${row.nombre}?`)) return;

    this.svc.delete(row.idGenero!.toString()).subscribe({
      next: (msg) => {
        console.log('genero eliminado:', msg);
        alert('genero eliminado exitosamente');
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error al eliminar el genero:', err);
        alert(err.error || 'Error al eliminar el genero');
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

