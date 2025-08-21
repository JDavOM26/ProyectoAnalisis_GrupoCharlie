import { Genero } from './../../Models/genero.model';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneroService } from '../../Service/genero.service';
import { Observable, BehaviorSubject, switchMap, startWith } from 'rxjs';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'genero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './genero.html',
  styleUrl: './genero.css'
})
export class GenerocComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);

  constructor(private fb: FormBuilder, private svc: GeneroService) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  generos$!: Observable<Genero[]>;

  //generos$ = this.svc.getGeneros();
  //estatus$ = this.svc.getEstatus();
  //sucursales$ = this.svc.getSucursales();

  fotoFile?: File;


  ngOnInit(): void {
    this.form = this.fb.group({
      IdGenero: ['', [Validators.required, Validators.minLength(3)]],
      Nombre: ['', Validators.required],
    });


    this.generos$ = this.refresh$.pipe(
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
      IdGenero: '', Nombre: '',
    });
    this.form.enable();
  }

  ver(row: Genero) {
    this.mode.set('ver');
    this.selectedId.set(row.IdGenero);
    this.form.patchValue(row);
    this.form.disable();
  }

  editar(row: Genero) {
    this.mode.set('editar');
    this.selectedId.set(row.IdGenero);
    this.form.patchValue(row);
    this.form.get('IdGenero')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => { if (c !== 'IdGenero') this.form.get(c)?.enable(); });
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
    const payload: Genero = this.form.getRawValue();

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

  eliminar(row: Genero) {
    if (!confirm(`¿Eliminar Genero ${row.IdGenero}?`)) return;
    this.svc.delete(row.IdGenero).subscribe(() => this.refresh$.next());
  }
}
