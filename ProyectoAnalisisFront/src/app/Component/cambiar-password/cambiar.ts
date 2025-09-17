import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'cambiar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambiar.html',
  styleUrls: ['./cambiar.css']
})
export class CambiarPasswordComponent {
  formPassword: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.formPassword = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$')
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { notMatching: true };
  }

  onSubmit() {
    this.submitted = true;
    if (this.formPassword.valid) {
      console.log('Datos a enviar:', this.formPassword.value);
      alert('Contraseña cambiada correctamente');
      // Aquí luego se llama al service que consume el backend
    }
  }
}
