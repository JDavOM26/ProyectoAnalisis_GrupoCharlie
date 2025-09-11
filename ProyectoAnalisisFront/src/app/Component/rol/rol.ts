import { Rol } from './../../Models/rol.model';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolService } from '../../Service/rol.service';
import { Observable, BehaviorSubject, switchMap, startWith } from 'rxjs';

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

  constructor(private fb: FormBuilder, private svc: RolService) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  roles$!: Observable<Rol[]>;


  fotoFile?: File;


  ngOnInit(): void {
    this.form = this.fb.group({
      IdRol: [''],
      Nombre: ['', Validators.required],
      IdUsuario: [''],
      FechaCreacion: [''],
      UsuarioCreacion: [''],
      FechaModificacion: [''],
      UsuarioModificacion: [''],
    });

    this.roles$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() }))
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
    this.form.reset({
      IdRol: '',
      Nombre: ''
    });
    this.form.enable();
  }

  ver(row: Rol) {
    this.mode.set('ver');
    this.selectedId.set(row.IdRole.toString());
    this.form.enable();
   this.form.patchValue(row);
    this.form.get('IdRole')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: Rol) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('IdRole')?.disable(); // no editar llave
    this.selectedId.set(row.IdRole.toString());
    this.form.patchValue(row);
    //Object.keys(this.form.controls).forEach(c => { if (c !== 'IdRol') this.form.get(c)?.enable(); });
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
      alert('Ingrese los datos correctamente.');
      return; 
    }
    const payload: Rol = this.form.getRawValue();

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

  eliminar(row: Rol) {
    if (!confirm(`¿Eliminar Rol ${row.IdRole}?`)) return;
    this.svc.delete(row.IdRole).subscribe(() => this.refresh$.next());
  }
}
