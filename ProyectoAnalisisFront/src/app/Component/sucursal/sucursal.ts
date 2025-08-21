import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SucursalService } from '../../Service/sucursal.service';
import { Sucursal } from '../../Models/sucursal.model';
import { Observable, BehaviorSubject, switchMap, startWith } from 'rxjs';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'sucursal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sucursal.html',
  styleUrl: './sucursal.css'
})
export class SucursalComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);

  constructor(private fb: FormBuilder, private svc: SucursalService) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  sucursales$!: Observable<Sucursal[]>;


  fotoFile?: File;


  ngOnInit(): void {
    this.form = this.fb.group({
      IdSucursal: ['', [Validators.required, Validators.minLength(3)]],
      Nombre: ['', Validators.required],
      Direccion: ['', Validators.required],
      IdEmpresa: [1,Validators.required],

    });

    this.sucursales$ = this.refresh$.pipe(
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
      IdSucursal: '', Nombre: '', Direccion: '',
      IdEmpresa: 1
    });
    this.form.enable();
  }

  ver(row: Sucursal) {
    this.mode.set('ver');
    this.selectedId.set(row.IdSucursal.toString());
    this.form.enable();
   this.form.patchValue(row);
    this.form.get('IdSucursal')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: Sucursal) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('IdSucursal')?.disable(); // no editar llave
    this.selectedId.set(row.IdSucursal.toString());
    this.form.patchValue(row);
    Object.keys(this.form.controls).forEach(c => { if (c !== 'IdSucursal') this.form.get(c)?.enable(); });
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
    const payload: Sucursal = this.form.getRawValue();

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

  eliminar(row: Sucursal) {
    if (!confirm(`¿Eliminar usuario ${row.IdSucursal}?`)) return;
    this.svc.delete(row.IdSucursal).subscribe(() => this.refresh$.next());
  }
}
