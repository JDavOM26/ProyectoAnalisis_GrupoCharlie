import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, switchMap, startWith, catchError, of } from 'rxjs';

import { UsuarioService } from '../../Service/usuario.service';
import { GeneroService } from '../../Service/genero.service';
import { RolService } from '../../Service/rol.service';
import { SucursalService } from '../../Service/sucursal.service';
import { EstatusUsuarioService } from '../../Service/estatususuario.service';

import { Usuario } from '../../Models/usuario.model';
import { Genero } from '../../Models/genero.model';
import { EstatusUsuario } from '../../Models/estatususuario.model';
import { Rol } from '../../Models/rol.model';
import { Sucursal } from '../../Models/sucursal.model';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css'
})
export class UsuariosComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);

  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');

  usuarios$!: Observable<Usuario[]>;
  generos$!: Observable<Genero[]>;
  estatus$!: Observable<EstatusUsuario[]>;
  roles$!: Observable<Rol[]>;
  sucursales$!: Observable<Sucursal[]>;

  fotoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private svc: UsuarioService,
    private generoSvc: GeneroService,
    private rolSvc: RolService,
    private sucursalSvc: SucursalService,
    private estatusSvc: EstatusUsuarioService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idUsuario: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      correoElectronico: ['', [Validators.email]],
      password: ['', Validators.required],
      telefonoMovil: ['', Validators.required],

      idGenero: [null, Validators.required],
      idStatusUsuario: [null, Validators.required],
      idSucursal: [null, Validators.required],
      idRole: [null, Validators.required],

      pregunta: [''],
      respuesta: [''],
      fotografia: [''],
      fechaCreacion: [''],
      usuarioCreacion: ['']
    });

    this.usuarios$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() })),
      catchError(err => { console.error('Error usuarios', err); return of([] as Usuario[]); })
    );

    this.generos$ = this.generoSvc.list().pipe(
      catchError(err => { console.error('Error géneros', err); return of([] as Genero[]); })
    );
    this.estatus$ = this.estatusSvc.list().pipe(
      catchError(err => { console.error('Error estatus', err); return of([] as EstatusUsuario[]); })
    );
    this.roles$ = this.rolSvc.list().pipe(
      catchError(err => { console.error('Error roles', err); return of([] as Rol[]); })
    );
    this.sucursales$ = this.sucursalSvc.list().pipe(
      catchError(err => { console.error('Error sucursales', err); return of([] as Sucursal[]); })
    );

    this.form.disable();
  }

  trackGenero   = (_: number, g: Genero) => g.idGenero;
  trackEstatus  = (_: number, e: EstatusUsuario) => e.idStatusUsuario;
  trackRol      = (_: number, r: Rol) => r.idRole;
  trackSucursal = (_: number, s: Sucursal) => s.idSucursal;

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const onlyBase64 = dataUrl.split(',')[1] ?? dataUrl;
      this.form.patchValue({ fotografia: onlyBase64 });
      this.fotoPreview = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  nuevo() {
    this.mode.set('crear');
    this.selectedId.set(null);
    this.form.reset();
    this.fotoPreview = null;
    this.form.enable();
  }

  ver(row: Usuario) {
    this.mode.set('ver');
    this.selectedId.set(row.idUsuario);

    this.fotoPreview = row.fotografia
      ? (row.fotografia.startsWith?.('data:') ? row.fotografia : `data:image/*;base64,${row.fotografia}`)
      : null;

    this.form.patchValue({
      idUsuario: row.idUsuario,
      nombre: row.nombre,
      apellido: row.apellido,
      fechaNacimiento: row.fechaNacimiento ?? '',
      correoElectronico: row.correoElectronico ?? '',
      telefonoMovil: row.telefonoMovil ?? '',

      idGenero: row.idGenero != null ? Number(row.idGenero) : null,
      idStatusUsuario: row.idStatusUsuario != null ? Number(row.idStatusUsuario) : null,
      idSucursal: row.idSucursal != null ? Number(row.idSucursal) : null,
      idRole: row.idRole != null ? Number(row.idRole) : null,

      pregunta: row.pregunta ?? '',
      respuesta: row.respuesta ?? '',
      fotografia: row.fotografia ?? '',
      password: row.password ?? '',
      fechaCreacion: row.fechaCreacion ?? '',
      usuarioCreacion: row.usuarioCreacion ?? ''
    });

    this.form.disable();
  }

  editar(row: Usuario) {
    this.mode.set('editar');
    this.selectedId.set(row.idUsuario);

    this.fotoPreview = row.fotografia
      ? (row.fotografia.startsWith?.('data:') ? row.fotografia : `data:image/*;base64,${row.fotografia}`)
      : null;

    this.form.patchValue({
      idUsuario: row.idUsuario,
      idGenero: row.idGenero != null ? Number(row.idGenero) : null,
      idStatusUsuario: row.idStatusUsuario != null ? Number(row.idStatusUsuario) : null,
      idSucursal: row.idSucursal != null ? Number(row.idSucursal) : null,
      idRole: row.idRole != null ? Number(row.idRole) : null,
      fechaNacimiento: row.fechaNacimiento ?? '',
      correoElectronico: row.correoElectronico ?? '',
      telefonoMovil: row.telefonoMovil ?? '',
      pregunta: row.pregunta ?? '',
      respuesta: row.respuesta ?? '',
      fotografia: row.fotografia ?? '',
      password: row.password ?? '',
      nombre: row.nombre,
      apellido: row.apellido,
      fechaCreacion: row.fechaCreacion ?? '',
      usuarioCreacion: row.usuarioCreacion ?? ''
    });

    this.form.get('idUsuario')?.disable();
    Object.keys(this.form.controls).forEach(c => { if (c !== 'idUsuario') this.form.get(c)?.enable(); });
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedId.set(null);
    this.form.reset();
    this.form.disable();
    this.fotoPreview = null;
  }

  guardar() {
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      alert('Por favor, complete los campos requeridos.');
      return; 
    }
    const payload = this.form.getRawValue() as Usuario;

    if (this.mode() === 'crear') {
      this.svc.create(payload).subscribe({
        next: (msg) => {
          alert('Usuario creado correctamente.');
          this.cancelar();
          this.refresh$.next();  
        },
        error: e => {
          console.error('Crear usuario', e);
          const serverMsg = (e?.error && typeof e.error === 'string') ? e.error : 'Error al crear usuario';
          alert(serverMsg);
        }
      });

    } else if (this.mode() === 'editar' && this.selectedId()) {
      this.svc.update(payload).subscribe({
        next: (msg) => {
          alert('Usuario actualizado correctamente.');
          this.cancelar();
          this.refresh$.next();
        },
        error: e => {
          console.error('Actualizar usuario', e);
          const serverMsg = (e?.error && typeof e.error === 'string') ? e.error : 'Error al actualizar usuario';
          alert(serverMsg);
        }
      });
    }
  }


  eliminar(row: Usuario) {
    if (!confirm(`¿Eliminar usuario ${row.idUsuario}?`)) return;
    this.svc.delete(row.idUsuario).subscribe(() => this.refresh$.next());
    this.form.reset();
  }
}
