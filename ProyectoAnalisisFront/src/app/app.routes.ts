import { SucursalComponent } from './Component/sucursal/sucursal';
import { Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login';
import { HomeComponent } from './Component/home/home';
import { UsuariosComponent } from './Component/usuario/usuario';
import { GenerocComponent } from './Component/genero/genero';
import { RolComponent } from './Component/rol/rol';
import { EstatusUsuarioComponent } from './Component/estatususuario/estatususuario';
import { OpcionComponent } from './Component/opcion/opcion';
import { PasswordRecovery } from './Component/password-recovery/password-recovery';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recover', component: PasswordRecovery },
   {
    path: 'home',
    component: HomeComponent,
    children: [
      // CRUD Usuarios (standalone)
      { path: 'usuarios', loadComponent: () => import('./Component/usuario/usuario').then(m => m.UsuariosComponent) },
       { path: 'sucursales', loadComponent: () => import('./Component/sucursal/sucursal').then(m => m.SucursalComponent) },
       { path: 'generos', loadComponent: () => import('./Component/genero/genero').then(m => m.GenerocComponent) },
       { path: 'roles', loadComponent: () => import('./Component/rol/rol').then(m => m.RolComponent) },
       { path: 'estatus-usuario', loadComponent: () => import('./Component/estatususuario/estatususuario').then(m => m.EstatusUsuarioComponent) },
       { path: 'opciones', loadComponent: () => import('./Component/opcion/opcion').then(m => m.OpcionComponent) }
       
      ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
