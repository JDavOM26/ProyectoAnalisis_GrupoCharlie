import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../Service/usuario.service';
import { Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../spinner-component/spinner-component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SpinnerComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  changePasswordForm!: FormGroup;
  errorMessage: string = '';
  newPasswordError: string = '';
  isLoading: boolean = false;
  showChangePasswordModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.changePasswordForm = this.fb.group({
      username: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });

    localStorage.clear();
  }

  onLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.newPasswordError = '';

    const { username, password } = this.loginForm.value;

    this.usuarioService.login(username, password).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        const data = response.token;
        const pIniRol = response.token.indexOf('"idRol":') + 8;
        const pFinRol = response.token.indexOf(',"');
        const rolRsp = data.substring(pIniRol, pFinRol);
        const pIniTkn = response.token.indexOf('"token":') + 9;
        const pFinTkn = response.token.indexOf('"}');
        const tokenRsp = data.substring(pIniTkn, pFinTkn);

        console.log('Login exitoso:', tokenRsp);
        localStorage.setItem('token', tokenRsp);
        localStorage.setItem('rol', rolRsp);
        localStorage.setItem('username', username);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al iniciar sesión', err);
        const errorMsg = typeof err.error === 'string' ? err.error : err.message || 'Error desconocido en el login. Intenta de nuevo.';
        this.errorMessage = errorMsg;

        if (errorMsg.includes('Contraseña vencida') || errorMsg.includes('Contraseña temporal vencida')) {
          this.showChangePasswordModal = true;
          this.changePasswordForm.patchValue({ username });
        } else if (errorMsg.includes('Intentos')) {
          this.errorMessage = `Acceso denegado: ${errorMsg}`;
        } else if (errorMsg.includes('bloqueada')) {
          this.errorMessage = 'Cuenta bloqueada por demasiados intentos fallidos. Contacta al administrador.';
        } else if (errorMsg.includes('inactiva')) {
          this.errorMessage = 'Cuenta inactiva. Contacta al administrador.';
        }
      }
    });
  }

  onSubmit(): void {
    this.onLogin();
  }

  onChangePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.newPasswordError = '';
    const { username, oldPassword, newPassword } = this.changePasswordForm.value;

    this.usuarioService.changePassword(username, oldPassword, newPassword).subscribe({
      next: (response: any) => {
        console.log('Respuesta del backend:', response); 
        this.isLoading = false;

      
        let responseMessage = typeof response === 'string' ? response : response?.message || JSON.stringify(response);
        responseMessage = responseMessage.trim(); 

        if (responseMessage === 'Contraseña actualizada correctamente.') {
          this.showChangePasswordModal = false; 
          this.errorMessage = 'Contraseña actualizada correctamente. Por favor, inicia sesión nuevamente.';
          this.changePasswordForm.reset();
          console.log('Cambio de contraseña exitoso, modal cerrado, mensaje:', this.errorMessage);
        } else {
          console.warn('Respuesta inesperada del backend:', responseMessage);
          this.errorMessage = 'Respuesta inesperada al cambiar la contraseña. Intenta de nuevo.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al cambiar contraseña:', err);
        const errorMsg = typeof err.error === 'string' ? err.error : err.message || 'Error al cambiar la contraseña. Intenta de nuevo.';
        if (errorMsg.includes('La contraseña debe') || errorMsg.includes('La contraseña no puede ser nula')) {
          this.newPasswordError = errorMsg; 
        } else {
          this.errorMessage = errorMsg;
        }
      }
    });
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
    this.changePasswordForm.reset();
    this.errorMessage = '';
    this.newPasswordError = '';
  }
}