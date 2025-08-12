import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

    if (username === 'admin' && password === 'admin') {
      this.router.navigate(['/home']);
    } else {
      console.log('Usuario o contraseña incorrectos');
    }
  }

  onSubmit() {
    this.onLogin();
  }
}