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
import { CrearUsuarioComponent } from './Component/usuario/crear-usuario';
import { EmpresaComponent } from './Component/empresa/empresa';
import { RoleOpcionComponent } from './Component/role-opcion/role-opcion';
import { AuthGuard } from './Service/auth.guard';
import { CierreMensualComponent } from './Component/cierremes/cierremes';
import { ConsultaSaldosComponent } from './Component/saldocliente/saldocliente';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recover', component: PasswordRecovery },
  { path: 'crear-usuario', component: CrearUsuarioComponent },
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
       { path: 'role-opcion', loadComponent: () => import('./Component/role-opcion/role-opcion').then(m => m.RoleOpcionComponent) },
       { path: 'opciones', loadComponent: () => import('./Component/opcion/opcion').then(m => m.OpcionComponent) },
       { path: 'empresas', loadComponent: () => import('./Component/empresa/empresa').then(m => m.EmpresaComponent) },
       { path: 'modulos', loadComponent: () => import('./Component/modulo/modulo').then(m => m.ModuloComponent) },
       { path: 'menus', loadComponent: () => import('./Component/menu/menu').then(m => m.MenuComponent) },
       { path: 'personas', loadComponent: () => import('./Component/persona/persona').then(m => m.PersonaComponent) },
       { path: 'tipos_documento', loadComponent: () => import('./Component/tipos_documento/tipos_documento').then(m => m.Tipoducumentocomponent) },
       { path: 'estado_civil', loadComponent: () => import('./Component/estado_civil/estado_civil').then(m => m.estadocivilComponent) },
       { path: 'tipo_movimiento_cxc', loadComponent: () => import('./Component/tipo_mov_cxc/tipo_movimiento_cxc').then(m => m.TipoMovimientoCxCComponent) },
       { path: 'tipo_saldo_cuenta', loadComponent: () => import('./Component/tipo_saldo_cuenta/tipo_saldo_cuenta').then(m => m.TipoSaldoCuentaComponent) },
       { path: 'saldo_cuenta', loadComponent: () => import('./Component/saldo_cuenta/saldo_cuenta').then(m => m.SaldoCuentaComponent) },
       { path: 'status-cuenta', loadComponent: () => import('./Component/statusdecuentas/statusdecuentas').then(m => m.statusdecuentasComponent) },
       { path: 'grabacion_movimientos', loadComponent: () => import('./Component/grabacion_movimientos/grabacion_movimientos').then(m => m.GrabacionMovimientosComponent) },
       { path: 'estado_cuenta', loadComponent: () => import('./Component/movimientos/estado_cuenta').then(m => m.EstadoCuentaComponent) },
       { path: 'cierremes', loadComponent: () => import('./Component/cierremes/cierremes').then(m => m.CierreMensualComponent) },
       { path: 'saldocliente', loadComponent: () => import('./Component/saldocliente/saldocliente').then(m => m.ConsultaSaldosComponent) }
      ],
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
