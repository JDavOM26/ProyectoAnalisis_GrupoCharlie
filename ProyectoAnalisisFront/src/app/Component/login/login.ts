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
  }

  onLogin(): void {
    const { username, password } = this.loginForm.value;

    console.log(username, password);
    
    this.usuarioService.login(
      this.loginForm.value.username, 
      this.loginForm.value.password
    ).subscribe({
      next: (response: any) => { 
        console.log('Inicio de sesión exitoso', response);
        this.router.navigate(['/home']);
      }, 
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        alert('Usuario o contraseña incorrectos');
      } 
    }) ;
  }

  onSubmit() {
    this.onLogin();
  }
}