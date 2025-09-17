import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../Service/usuario.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    localStorage.clear();
  }

  onLogin(): void {
    const { username, password } = this.loginForm.value;
    this.errorMessage = '';
    console.log(username, password);

    this.usuarioService.login(
      this.loginForm.value.username,
      this.loginForm.value.password
    ).subscribe({
      next: (response: any) => {
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
        localStorage.setItem('username', this.loginForm.value.username);
        this.router.navigate(['/home']);
      },

      error: (err) => {
        console.error('Error al iniciar sesión', err);
        this.errorMessage = err.error || 'Error desconocido en el login. Intenta de nuevo.';
        if (this.errorMessage.includes('Intentos')) {
          this.errorMessage = `Acceso denegado: ${this.errorMessage}`;
        } else if (this.errorMessage.includes('bloqueada')) {
          this.errorMessage = 'Cuenta bloqueada por demasiados intentos fallidos. Contacta al administrador.';
        } else if (this.errorMessage.includes('inactiva')) {
          this.errorMessage = 'Cuenta inactiva. Contacta al administrador.';
        }
      }
    });
  }

  onSubmit() {
    this.onLogin();
  }
}