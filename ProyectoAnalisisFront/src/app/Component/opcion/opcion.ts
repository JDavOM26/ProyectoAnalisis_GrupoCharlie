import { Opcion } from './../../Models/opcion.model';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpcionService } from '../../Service/opcion.service';
import { Observable, BehaviorSubject, switchMap, startWith } from 'rxjs';

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
  selectedId = signal<string | null>(null);

  constructor(private fb: FormBuilder, private svc: OpcionService) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  opciones$!: Observable<Opcion[]>;


  fotoFile?: File;


  ngOnInit(): void {
    this.form = this.fb.group({
      IdRol: ['', [Validators.required, Validators.minLength(3)]],
      Nombre: ['', Validators.required],
    });

    this.opciones$ = this.refresh$.pipe(
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
      IdOpcion: '', IdMenu: '', Nombre: '', OrdenMenu: '', Pagina: ''
    });
    this.form.enable();
  }

  ver(row: Opcion) {
    this.mode.set('ver');
    this.selectedId.set(row.IdOpcion.toString());
    this.form.enable();
   this.form.patchValue(row);
    this.form.get('IdOpcion')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: Opcion) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('IdOpcion')?.disable(); // no editar llave
    this.selectedId.set(row.IdOpcion.toString());
    this.form.patchValue(row);
    Object.keys(this.form.controls).forEach(c => { if (c !== 'IdOpcion') this.form.get(c)?.enable(); });
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
    const payload: Opcion = this.form.getRawValue();

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

  eliminar(row: Opcion) {
    if (!confirm(`¿Eliminar la opcion ${row.IdOpcion}?`)) return;
    this.svc.delete(row.IdOpcion).subscribe(() => this.refresh$.next());
  }
}
