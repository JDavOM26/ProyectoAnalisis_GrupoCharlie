import { Opcion } from './../../Models/opcion.model';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpcionService } from '../../Service/opcion.service';
import { Observable, BehaviorSubject, switchMap, startWith, map } from 'rxjs';
import { MenuService } from '../../Service/menu.service';
import { Menu } from '../../Models/menu.model';
import { Permisos } from '../../Models/menu.perm.model';
import { MenuDinamicoService } from '../../Service/menu-dinamico.service';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'opcion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './opcion.html',
  styleUrl: './opcion.css'
})
export class OpcionComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedIdOpcion = signal<string | null>(null);
  selectedIdMenu = signal<string | null>(null);
  permisos: Permisos = { Alta:false, Baja:false, Cambio:false, Imprimir:false, Exportar:false };

  constructor(
    private fb: FormBuilder, 
    private svc: OpcionService,
    private svcMenu: MenuService,
    private menuSvc: MenuDinamicoService
  ) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  opciones$!: Observable<Opcion[]>;
  menus$!: Observable<Menu[]>;
  menusMap$!: Observable<Record<string, string>>;

  vm$!: Observable<{menusMap: Record<number,string>}>;

  ngOnInit(): void {
    this.form = this.fb.group({
      IdOpcion: [''],
      IdMenu: ['', Validators.required],
      Nombre: ['', Validators.required],
      OrdenMenu: ['', Validators.required],
      Pagina: ['', Validators.required],
      FechaCreacion: [''],
      UsuarioCreacion: [''],
      FechaModificacion: [''],
      UsuarioModificacion: [''],
      IdUsuario: ['']
    });

    this.opciones$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() }))
    );

    this.menus$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svcMenu.list({search: this.search()}))
    );

    this.menusMap$ = this.menus$.pipe(
      map(menus =>
        menus.reduce((acc, r) => {
          const key = Number((r as any).IdMenu);
          acc[key] = (r as any).Nombre;
          return acc;
        }, {} as Record<number, string>)
      )
    );

    this.vm$ = this.menusMap$.pipe(
      map(menusMap => ({ menusMap }))
    );

    const pageKey = 'opcion'; 
    this.permisos = this.menuSvc.getPermisosFromLocal(pageKey);
    console.log('Permisos desde localStorage:', this.permisos);

    if (!this.permisos || Object.values(this.permisos).every(v => v === false)) {
      this.menuSvc.getPermisos(pageKey).subscribe(p => {
        this.permisos = p;
        console.log('Permisos desde backend:', p);
      });
    }

    this.form.disable();
  }

  trackMenu = (_: number, item: Menu) => item.IdMenu;

  nuevo() {
    if (!this.permisos.Alta) return;
    this.mode.set('crear');
    this.selectedIdOpcion.set(null);
    this.selectedIdMenu.set(null);
    this.form.reset({
      IdOpcion: '', 
      IdMenu: '', 
      Nombre: '', 
      OrdenMenu: '', 
      Pagina: ''
    });
    this.form.enable();
  }

  ver(row: Opcion) {
    this.mode.set('ver');
    this.selectedIdOpcion.set(row.IdOpcion.toString());
    this.form.enable();
    this.form.patchValue(row);
    this.form.get('IdOpcion')?.disable(); 
    this.form.get('IdMenu')?.disable(); 
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: Opcion) {
    if (!this.permisos.Cambio) return;
    this.mode.set('editar');
    this.form.enable();
    this.form.get('IdOpcion')?.disable(); 
    this.form.get('IdMenu')?.disable(); 
    this.selectedIdOpcion.set(row.IdOpcion.toString());
    this.selectedIdMenu.set(row.IdMenu.toString());
    this.form.patchValue(row);
    Object.keys(this.form.controls).forEach(c => { if (c !== 'IdOpcion' && c !== 'IdMenu') this.form.get(c)?.enable(); });
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedIdOpcion.set(null);
    this.selectedIdMenu.set(null);
    this.form.reset();
    this.form.disable();
  }

  guardar() {
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      alert('Ingrese todos los campos requeridos.');
      return; 
    }
    const payload: Opcion = this.form.getRawValue();

    if (this.mode() === 'crear') {
      this.svc.create(payload).subscribe(() => {
        this.cancelar(); this.refresh$.next();
      });
    } else if (this.mode() === 'editar' && this.selectedIdOpcion()) {
      this.svc.update(this.selectedIdOpcion()!, payload).subscribe(() => {
        this.cancelar(); this.refresh$.next();
      });
    }
  }

  eliminar(row: Opcion) {
    if (!this.permisos.Baja) return;
    if (!confirm(`¿Eliminar la opción ${row.Nombre}?`)) return;
    this.svc.delete(row.IdOpcion).subscribe({
      next: (msg) => {
        alert('Opción eliminada correctamente.');
        this.refresh$.next(); 
        if (this.selectedIdOpcion() === String(row.IdOpcion)) {
          this.cancelar();
        }
        this.refresh$.next();
      }, error: e => alert(typeof e?.error === 'string' ? e.error : 'Error al eliminar la opción')
    });
  }
}
