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

interface MovimientoConNumero extends MovimientoMensual {
  mesNumero: number;
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
  errorMessage: string | null = null;

  estadisticas: any = {};
  movimientosMensuales: MovimientoMensual[] = [];

  private apiUrl = 'http://localhost:8080/api/auth/dashboard';

  constructor(
    private http: HttpClient,
    public router: Router,
    private menuSvc: MenuDinamicoService
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticasCompletas();
    this.menu$ = this.menuSvc.getMenuTree();
  }

 cargarEstadisticasCompletas(): void {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  this.http.get<EstadisticasCompletas>(`${this.apiUrl}/estadisticas-completas`, { headers }).subscribe(
    (data) => {
      const apiData = data.movimientosMensuales || [];

     
      let mesesConDatos: MovimientoConNumero[] = apiData
        .filter(mov => mov.TotalMovimientos > 0)
        .map(mov => ({
          Mes: mov.Mes,
          NombreMes: mov.NombreMes,
          TotalMovimientos: mov.TotalMovimientos,
          mesNumero: this.getMonthNumber(mov.NombreMes)
        } as MovimientoConNumero));

     
      mesesConDatos.sort((a, b) => a.mesNumero - b.mesNumero);

      
      this.movimientosMensuales = mesesConDatos
        .slice(-6)
        .map(({ mesNumero, ...mov }) => mov);
    },
    (error) => {
      console.error('Error al cargar estadísticas:', error);
      this.errorMessage = 'No se pudieron cargar las estadísticas. Por favor, intenta de nuevo.';
      this.movimientosMensuales = [];
    }
  );
}

 
  private getMonthNumber(nombreMes: string): number {
    const meses: { [key: string]: number } = {
      'January': 1, 'February': 2, 'March': 3, 'April': 4,
      'May': 5, 'June': 6, 'July': 7, 'August': 8,
      'September': 9, 'October': 10, 'November': 11, 'December': 12
    };
    return meses[nombreMes] || 0;
  }

  calcularAlturaBarra(valor: number): number {
    if (this.movimientosMensuales.length === 0) return 0;
    const max = Math.max(...this.movimientosMensuales.map(m => m.TotalMovimientos), 1);
    return (valor / max) * 100;
  }

  obtenerNombreMesCorto(nombreMes: string): string {
    const meses: { [key: string]: string } = {
      January: 'Ene', February: 'Feb', March: 'Mar', April: 'Abr',
      May: 'May', June: 'Jun', July: 'Jul', August: 'Ago',
      September: 'Sep', October: 'Oct', November: 'Nov', December: 'Dic'
    };
    return meses[nombreMes] || nombreMes.substring(0, 3);
  }

  toRoute(pagina: string | undefined | null): string | null {
    if (!pagina) return null;
    const base = pagina.replace('.html', '').toLowerCase();
    const map: Record<string, string> = {
      'empresa': 'empresas', 'sucursal': 'sucursales', 'genero': 'generos',
      'rol': 'roles', 'estatususuario': 'estatus-usuario', 'opcion': 'opciones',
      'modulo': 'modulos', 'menu': 'menus', 'usuario': 'usuarios',
      'role-opcion': 'role-opcion', 'persona': 'personas', 'tipos_documento': 'tipos_documento',
      'estado_civil': 'estado_civil', 'tipo_movimiento_cxc': 'tipo_movimiento_cxc',
      'tipo_saldo_cuenta': 'tipo_saldo_cuenta', 'saldo_cuenta': 'saldo_cuenta',
      'status_cuenta': 'status-cuenta', 'grabacion_movimientos': 'grabacion_movimientos',
      'estado_cuenta': 'estado_cuenta'
    };
    return map[base] ? `/home/${map[base]}` : null;
  }

  toHref(pagina: string | undefined | null): string | null {
    return null;
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
