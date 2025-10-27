import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { MenuDinamicoService } from '../../Service/menu-dinamico.service';
import { ModuleNode } from '../../Models/menu.perm.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  menu$!: Observable<ModuleNode[]>;

  constructor(
    public router: Router,
    private menuSvc: MenuDinamicoService
  ) {}

  ngOnInit(): void {
    this.menu$ = this.menuSvc.getMenuTree();
  }

  toRoute(pagina: string | undefined | null): string | null {
    if (!pagina) return null;

    const base = pagina.replace('.html', '').toLowerCase();

    const map: Record<string, string> = {
      'empresa': 'empresas',
      'sucursal': 'sucursales',
      'genero': 'generos',
      'rol': 'roles',
      'estatususuario': 'estatus-usuario',
      'opcion': 'opciones',
      'modulo': 'modulos',
      'menu': 'menus',
      'usuario': 'usuarios',
      'role-opcion': 'role-opcion',
      'persona': 'personas',
      'tipos_documento': 'tipos_documento',
      'estado_civil': 'estado_civil',
      'tipo_movimiento_cxc': 'tipo_movimiento_cxc',
      'tipo_saldo_cuenta': 'tipo_saldo_cuenta', 
      'saldo_cuenta': 'saldo_cuenta',
      'status_cuenta': 'status-cuenta',
      'grabacion_movimientos': 'grabacion_movimientos',
      'estado_cuenta': 'estado_cuenta'
    };

    return map[base] ? `/home/${map[base]}` : null;
  }


  /** Si quisieras soportar enlaces externos (no rutas Angular) */
  toHref(pagina: string | undefined | null): string | null {
    if (!pagina) return null;
    // aquí podrías decidir devolver URL absolutas. De momento todo va por rutas Angular.
    return null;
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
