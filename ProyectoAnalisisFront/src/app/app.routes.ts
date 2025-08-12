import { Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login';
import { HomeComponent } from './Component/home/home';
import { UsuariosComponent } from './Component/usuario/usuario';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
   {
    path: 'home',
    component: HomeComponent,
    children: [
      // CRUD Usuarios (standalone)
      { path: 'usuarios', loadComponent: () => import('./Component/usuario/usuario').then(m => m.UsuariosComponent) },
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
