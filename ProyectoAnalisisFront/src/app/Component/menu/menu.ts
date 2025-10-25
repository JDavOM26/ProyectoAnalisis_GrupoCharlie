import { Menu } from '../../Models/menu.model';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuService } from '../../Service/menu.service';
import { Observable, BehaviorSubject, switchMap, startWith, map, combineLatest } from 'rxjs';
import { ModuloService } from '../../Service/modulo.service';
import { Modulo } from '../../Models/modulo.model';
import { Permisos } from '../../Models/menu.perm.model';
import { MenuDinamicoService } from '../../Service/menu-dinamico.service';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);
  selectedIdModulo = signal<string | null>(null);
  permisos: Permisos = { Alta:false, Baja:false, Cambio:false, Imprimir:false, Exportar:false };

  constructor(
    private fb: FormBuilder, 
    private svc: MenuService,
    private svcModulo: ModuloService,
    private menuSvc: MenuDinamicoService
  ) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  menus$!: Observable<Menu[]>;
  modulos$!: Observable<any[]>;
  modulosMap$!: Observable<Record<string,string>>;

  vm$!: Observable<{modulosMap: Record<number,string>}>;

  
  ngOnInit(): void {
    this.form = this.fb.group({
      IdMenu: [''],
      IdModulo: ['', Validators.required],
      Nombre: ['', Validators.required],
      OrdenMenu: ['', Validators.required],
      IdUsuario: [''],
      FechaCreacion: [''],
      UsuarioCreacion: [''],
      FechaModificacion: [''],
      UsuarioModificacion: [''],
    });
    
    this.menus$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svc.list({ search: this.search() }))
    );
    
    this.modulos$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.svcModulo.list({ search: this.search() }))
    );

    this.modulosMap$ = this.modulos$.pipe(
      map(modulos => modulos.reduce((acc,r) => {
        const key = Number((r as any).IdModulo ?? (r as any).idModulo);
        acc[key] = (r as any).Nombre;
        return acc;
      },{} as Record<number, string>))
    );

    this.vm$ = this.modulosMap$.pipe(
      map(modulosMap => ({modulosMap}))
    );

    const pageKey = 'menu'; 
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

  trackModulo = (_:number, item: Modulo) => item.IdModulo;

  nuevo() {
    if (!this.permisos.Alta) return;
    this.mode.set('crear');
    this.selectedId.set(null);
    this.selectedIdModulo.set(null);
    this.form.reset({
      IdMenu: '',
      IdModulo: '',
      Nombre: '',
      OrdenMenu: '',
    });
    this.form.enable();
  }

  ver(row: Menu) {
    this.mode.set('ver');
    this.selectedId.set(row.IdMenu.toString());
    this.form.enable();
    this.form.patchValue(row);
    this.form.get('IdMenu')?.disable();
    this.form.get('IdModulo')?.disable();
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: Menu) {
    if (!this.permisos.Cambio) return;
    this.mode.set('editar');
    this.form.enable();
    this.form.get('IdMenu')?.disable();
    this.form.get('IdModulo')?.disable();
    this.selectedId.set(row.IdMenu.toString());
    this.selectedIdModulo.set(row.IdModulo.toString());
    this.form.patchValue(row);
    Object.keys(this.form.controls).forEach(c => { if (c !== 'IdMenu' && c !== 'IdModulo') this.form.get(c)?.enable(); });
  }

  cancelar() {
    this.mode.set('idle');
    this.selectedId.set(null);
    this.selectedIdModulo.set(null);
    this.form.reset();
    this.form.disable();
  }

  guardar() {
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      alert('Ingrese los datos correctamente.');
      return; 
    }
    const payload: Menu = this.form.getRawValue();

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

  eliminar(row: Menu) {
    if (!this.permisos.Baja) return;
    if (!confirm(`¿Eliminar Menu ${row.Nombre}?`)) return;
    this.svc.delete(row.IdMenu).subscribe(() => this.refresh$.next());
  }
}
