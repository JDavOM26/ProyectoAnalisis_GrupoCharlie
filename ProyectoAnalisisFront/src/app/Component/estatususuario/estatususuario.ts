import { EstatusUsuarioService } from './../../Service/estatususuario.service';
import { EstatusUsuario } from './../../Models/estatususuario.model';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { EstatusUsuarioService } from '../../Service/estatususuario.service';
import { Observable, BehaviorSubject, switchMap, startWith } from 'rxjs';
import { MenuDinamicoService } from '../../Service/menu-dinamico.service';
import { Permisos } from '../../Models/menu.perm.model';


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


  constructor(
    private fb: FormBuilder, 
    private svc: EstatusUsuarioService,
    private menuSvc: MenuDinamicoService
  ) {}


  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  Estatususuario$!: Observable<EstatusUsuario[]>;
  permisos: Permisos = { Alta:false, Baja:false, Cambio:false, Imprimir:false, Exportar:false };

  fotoFile?: File;

  constructor(private fb: FormBuilder, private svc: EstatusUsuarioService) {}

  ngOnInit(): void {
    this.form = this.fb.group({

      IdStatusUsuario: [''],
      Nombre: ['', Validators.required],

    });

    this.Estatususuario$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() })),
      catchError(err => {
        console.error('Error cargando los Estatus', err);
        return of([] as EstatusUsuario[]);
      })
    );


    const pageKey = 'estatususuario'; 
    this.permisos = this.menuSvc.getPermisosFromLocal(pageKey);

    if (!this.permisos || Object.values(this.permisos).every(v => v === false)) {
      this.menuSvc.getPermisos(pageKey).subscribe(p => {
        this.permisos = p;
      });
    }

    this.form.disable();
  }

  nuevo() {
    if (!this.permisos.Alta) return;
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
    if (!this.permisos.Cambio) return;
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


  guardar() {
    if (this.form.invalid) { 
      alert('Debe completar los campos requeridos');
      this.form.markAllAsTouched(); 
      return; 
    }
    
    const payload: EstatusUsuario = this.form.getRawValue();

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
}


  eliminar(row: EstatusUsuario) {

    if (!this.permisos.Baja) return;
    if (!confirm(`¿Eliminar el Estatus ${row.Nombre}?`)) return;
    this.svc.delete(row.IdStatusUsuario).subscribe(() => this.refresh$.next());

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

