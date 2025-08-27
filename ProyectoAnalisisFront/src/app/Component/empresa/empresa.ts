import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpresaService } from '../../Service/empresa.service';
import { Empresa } from '../../Models/empresa.model';
import { Observable, BehaviorSubject, switchMap, startWith } from 'rxjs';

type Mode = 'crear' | 'editar' | 'ver' | 'idle';

@Component({
  selector: 'Empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empresa.html',
  styleUrl: './empresa.css'
})
export class EmpresaComponent implements OnInit {
  form!: FormGroup;
  mode = signal<Mode>('idle');
  selectedId = signal<string | null>(null);

  constructor(private fb: FormBuilder, private svc: EmpresaService) {}

  // list + filtro
  private refresh$ = new BehaviorSubject<void>(undefined);
  search = signal('');
  Empresas$!: Observable<Empresa[]>;


  fotoFile?: File;


  ngOnInit(): void {
    this.form = this.fb.group({
      idEmpresa: ['', [Validators.required, Validators.minLength(3)]],
      Nombre: ['', Validators.required],
      Direccion: ['', Validators.required],

    });

    this.Empresas$ = this.refresh$.pipe(
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
      idEmpresa: '', Nombre: '', Direccion: '',
    });
    this.form.enable();
  }

  ver(row: Empresa) {
    this.mode.set('ver');
    this.selectedId.set(row.idEmpresa.toString());
    this.form.enable();
   this.form.patchValue(row);
    this.form.get('idEmpresa')?.disable(); // no editar llave
    Object.keys(this.form.controls).forEach(c => this.form.get(c)?.disable());
  }

  editar(row: Empresa) {
    this.mode.set('editar');
    this.form.enable();
    this.form.get('idEmpresa')?.disable(); // no editar llave
    this.selectedId.set(row.idEmpresa.toString());
    this.form.patchValue(row);
    Object.keys(this.form.controls).forEach(c => { if (c !== 'idEmpresa') this.form.get(c)?.enable(); });
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
    const payload: Empresa = this.form.getRawValue();

    if (this.mode() === 'crear') {      
        this.cancelar(); this.refresh$.next();
    } else if (this.mode() === 'editar' && this.selectedId()) {
        this.cancelar(); this.refresh$.next();
    }
  }

  eliminar(row: Empresa) {
    if (!confirm(`¿Eliminar usuario ${row.idEmpresa}?`)) return;
    this.svc.delete(row.idEmpresa).subscribe(() => this.refresh$.next());
  }
}
