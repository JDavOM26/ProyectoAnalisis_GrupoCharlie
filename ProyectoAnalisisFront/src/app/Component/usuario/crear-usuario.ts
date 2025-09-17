import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable, BehaviorSubject, switchMap, startWith, catchError, of } from 'rxjs';

import { UsuarioService } from '../../Service/usuario.service';
import { GeneroService } from '../../Service/genero.service';
import { Genero } from '../../Models/genero.model';
import { Usuario } from '../../Models/usuario.model';

import { RolService } from '../../Service/rol.service';
import { SucursalService } from '../../Service/sucursal.service';
import { EstatusUsuarioService } from '../../Service/estatususuario.service';

import { EstatusUsuario } from '../../Models/estatususuario.model';
import { Rol } from '../../Models/rol.model';
import { Sucursal } from '../../Models/sucursal.model';

type Mode = 'crear' | 'idle';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-usuario.html',
  styleUrls: ['./crear-usuario.css'],
})
export class CrearUsuarioComponent implements OnInit {
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
      private estatusSvc: EstatusUsuarioService,
      private router: Router
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
  
    cancelar() {
        this.router.navigate(['/login']);
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
      }
    }
}
