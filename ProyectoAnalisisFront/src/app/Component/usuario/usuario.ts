import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../Service/usuario.service';
import { Usuario } from '../../Models/usuario.model';
import { Observable, BehaviorSubject, switchMap, startWith } from 'rxjs';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css'
})
export class UsuariosComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);
  
  constructor(private fb: FormBuilder, private svc: UsuarioService) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  usuarios$!: Observable<Usuario[]>;

  //generos$ = this.svc.getGeneros();
  //estatus$ = this.svc.getEstatus();
  //sucursales$ = this.svc.getSucursales();

  fotoFile?: File;


  ngOnInit(): void {
    this.form = this.fb.group({
      idUsuario: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: [''],
      idStatusUsuario: [1, Validators.required],
      password: [''],
      idGenero: [1, Validators.required],
      ultimaFechaIngreso: [''],
      intentosDeAcceso: [0],
      sesionActual: [''],
      ultimaFechaCambioPassword: [''],
      correoElectronico: ['', Validators.email],
      requiereCambiarPassword: [0],
      telefonoMovil: [''],
      idSucursal: [1, Validators.required],
      pregunta: [''],
      respuesta: ['']
    });

    this.usuarios$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() }))
    );
  }

  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length) this.fotoFile = input.files[0];
  }

  nuevo() {
    this.mode.set('crear');
    this.selectedId.set(null);
    this.form.reset({
      idUsuario: '', nombre: '', apellido: '',
      idStatusUsuario: 1, idGenero: 1, idSucursal: 1,
      intentosDeAcceso: 0, requiereCambiarPassword: 0
    });
    this.form.enable();
  }

  ver(row: Usuario) {
    this.mode.set('ver');
    this.selectedId.set(row.idUsuario);
    this.form.patchValue(row);
    this.form.disable();
  }

  editar(row: Usuario) {
    this.mode.set('editar');
    this.selectedId.set(row.idUsuario);
    this.form.patchValue({ ...row, password: '' });
    this.form.get('idUsuario')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => { if (c !== 'idUsuario') this.form.get(c)?.enable(); });
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedId.set(null);
    this.form.reset();
    this.form.enable();
    this.fotoFile = undefined;
  }

  guardar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload: Usuario = this.form.getRawValue();

    if (this.mode() === 'crear') {
      this.svc.create(payload, this.fotoFile).subscribe(() => {
        this.cancelar(); this.refresh$.next();
      });
    } else if (this.mode() === 'editar' && this.selectedId()) {
      this.svc.update(this.selectedId()!, payload, this.fotoFile).subscribe(() => {
        this.cancelar(); this.refresh$.next();
      });
    }
  }

  eliminar(row: Usuario) {
    if (!confirm(`¿Eliminar usuario ${row.idUsuario}?`)) return;
    this.svc.delete(row.idUsuario).subscribe(() => this.refresh$.next());
  }
}
