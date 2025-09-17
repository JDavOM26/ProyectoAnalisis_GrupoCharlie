
import { RolService } from './../../Service/rol.service';
import { Rol } from './../../Models/rol.model';;
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, switchMap, startWith, catchError, of } from 'rxjs';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'rol',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rol.html',
  styleUrl: './rol.css'
})
export class RolComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  roles$!: Observable<Rol[]>;

  fotoFile?: File;

  constructor(private fb: FormBuilder, private svc: RolService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idRole: [''],
      Nombre: ['', Validators.required]
    });

    this.roles$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() })),
      catchError(err => {
        console.error('Error cargando los roles', err);
        return of([] as Rol[]);
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

  ver(row: Rol) {
    this.mode.set('ver');
    this.selectedId.set(row.idRole!.toString());
    this.form.enable();
    this.form.patchValue({
      idRole: row.idRole,
      Nombre: row.nombre
    });
      //
    this.form.get('idRole')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: Rol) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('idRole')?.disable(); // no editar llave
    this.selectedId.set(row.idRole!.toString());
    this.form.patchValue({
      idRole: row.idRole,
      Nombre: row.nombre
    });
    Object.keys(this.form.controls).forEach(c => { if (c !== 'idRole') this.form.get(c)?.enable(); });
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedId.set(null);
    this.form.reset();
    this.form.enable();
    this.fotoFile = undefined;
  }

  private buildCreateBody(): Partial<Rol> {
    const v = this.form.getRawValue();
    return {
      idRole: v.idRole,
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
      idUsuario: usuario
    };
    console.log('CREATE body:', body);

    this.svc.create(body as Rol).subscribe({
      next: (created) => {
        console.log('Rol creado:', created);
        alert('¡Rol creado correctamente!');
        this.cancelar();
        this.refresh$.next();
      },
      error: (err) => {
        console.error('Error al crear el rol', err);
        alert('Error al crear el rol. Verificar la informacion.');
      }
    });

  } else if (this.mode() === 'editar' && this.selectedId()) {
    const body = {
      ...this.buildCreateBody(),
      idUsuario: usuario
    };
    console.log('UPDATE body:', body);

    this.svc.update(this.selectedId()!, body as Rol).subscribe({
      next: (updated) => {
        console.log('Rol actualizada:', updated);
        alert('¡Rol actualizado correctamente!');
        this.cancelar();
        this.refresh$.next();
      },
      error: (err) => {
        console.error('Error al actualizar el rol', err);
        alert('Error al actualizar el rol. Verificar la información.');
      }
    });
  }
}


  eliminar(row: Rol) {
    if (!confirm(`¿Eliminar el rol ${row.idRole}?`)) return;

    this.svc.delete(row.idRole!.toString()).subscribe({
      next: (msg) => {
        console.log('Rol eliminado:', msg);
        alert('Rol eliminado exitosamente');
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error al eliminar el rol:', err);
        alert(err.error || 'Error al eliminar el rol');
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

