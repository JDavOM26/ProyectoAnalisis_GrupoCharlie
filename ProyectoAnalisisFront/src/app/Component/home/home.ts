import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  constructor(public router: Router) {}

  logout(): void {
    // Limpia lo que uses para sesión (tokens, usuario, etc.)
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
