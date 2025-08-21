import { EstatusUsuario } from './../../Models/estatususuario.model';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstatusUsuarioService } from '../../Service/estatususuario.service';
import { Observable, BehaviorSubject, switchMap, startWith } from 'rxjs';

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

  constructor(private fb: FormBuilder, private svc: EstatusUsuarioService) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  Estatususuario$!: Observable<EstatusUsuario[]>;

  //generos$ = this.svc.getGeneros();
  //estatus$ = this.svc.getEstatus();
  //sucursales$ = this.svc.getSucursales();

  fotoFile?: File;


  ngOnInit(): void {
    this.form = this.fb.group({
      IdGenero: ['', [Validators.required, Validators.minLength(3)]],
      Nombre: ['', Validators.required],
    });


    this.Estatususuario$ = this.refresh$.pipe(
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
      IdEstatus: '', Nombre: '',
    });
    this.form.enable();
  }

  ver(row: EstatusUsuario) {
    this.mode.set('ver');
    this.selectedId.set(row.IdEstatus);
    this.form.patchValue(row);
    this.form.disable();
  }

  editar(row: EstatusUsuario) {
    this.mode.set('editar');
    this.selectedId.set(row.IdEstatus);
    this.form.patchValue(row);
    this.form.get('IdEstatus')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => { if (c !== 'IdEstatus') this.form.get(c)?.enable(); });
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
    const payload: EstatusUsuario = this.form.getRawValue();

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

  eliminar(row: EstatusUsuario) {
    if (!confirm(`¿Eliminar el Estatus ${row.IdEstatus}?`)) return;
    this.svc.delete(row.IdEstatus).subscribe(() => this.refresh$.next());
  }
}
