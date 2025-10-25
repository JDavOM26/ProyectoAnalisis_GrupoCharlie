import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { MenuDinamicoService } from '../../Service/menu-dinamico.service';
import { ModuleNode } from '../../Models/menu.perm.model';
import { HttpClient } from '@angular/common/http';

interface EstadisticasCompletas {
  movimientosMensuales: MovimientoMensual[];
}

interface MovimientoMensual {
  Mes: string;
  NombreMes: string;
  TotalMovimientos: number;
}



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  menu$!: Observable<ModuleNode[]>;
  fechaActual = new Date();
  Math = Math;

  estadisticas: any = {
    totalClientes: 0,
    ingresosTotales: 0,
    cuentasActivas: 0,
    totalTransacciones: 0,
    cambioClientes: 0,
    cambioIngresos: 0,
    cambioCuentas: 0,
    cambioTransacciones: 0
  };

  movimientosMensuales: MovimientoMensual[] = [];


  coloresPie = ['#10152b', '#1a2244', '#2c3e6d', '#3d5a96'];

  private apiUrl = 'http://localhost:8080/api/auth/dashboard';

  constructor(private http: HttpClient, public router: Router,
    private menuSvc: MenuDinamicoService) { }

  ngOnInit(): void {
    this.cargarEstadisticasCompletas();
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
    'saldo_cuenta': 'saldo_cuenta'
  };

  return map[base] ? `/home/${map[base]}` : null;
}



toHref(pagina: string | undefined | null): string | null {
  if (!pagina) return null;
  
  return null;
}

logout(): void {
  localStorage.clear();
  sessionStorage.clear();
  this.router.navigate(['/login']);
}

cargarEstadisticasCompletas(): void {
  const token = localStorage.getItem('token'); 
  const headers = { Authorization: `Bearer ${token}` };

  this.http.get<EstadisticasCompletas>(`${this.apiUrl}/estadisticas-completas`, { headers })
    .subscribe(
      data => {
        this.estadisticas = {
        };
        this.movimientosMensuales = data.movimientosMensuales || [];
     
      },
      error => {
        console.error('Error al cargar estadísticas:', error);
      }
    );
}


calcularAlturaBarra(valor: number): number {
  if (this.movimientosMensuales.length === 0) return 0;
  const max = Math.max(...this.movimientosMensuales.map(m => m.TotalMovimientos));
  return max > 0 ? (valor / max) * 100 : 0;
}

obtenerNombreMesCorto(nombreMes: string): string {
  const meses: { [key: string]: string } = {
    'January': 'Ene', 'February': 'Feb', 'March': 'Mar',
    'April': 'Abr', 'May': 'May', 'June': 'Jun',
    'July': 'Jul', 'August': 'Ago', 'September': 'Sep',
    'October': 'Oct', 'November': 'Nov', 'December': 'Dic'
  };
  return meses[nombreMes] || nombreMes.substring(0, 3);
}



}