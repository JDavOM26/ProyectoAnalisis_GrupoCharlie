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
  errorMessage: string | null = null;

  estadisticas: any = {};
  movimientosMensuales: MovimientoMensual[] = [];

  private apiUrl = 'http://localhost:8080/api/auth/dashboard';

  constructor(private http: HttpClient, public router: Router, private menuSvc: MenuDinamicoService) {}

  ngOnInit(): void {
    this.cargarEstadisticasCompletas();
    this.menu$ = this.menuSvc.getMenuTree();
  }


  private getAllMonths(): MovimientoMensual[] {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.map((month, index) => ({
      Mes: (index + 1).toString().padStart(2, '0'),
      NombreMes: month,
      TotalMovimientos: 0
    }));
  }

  cargarEstadisticasCompletas(): void {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<EstadisticasCompletas>(`${this.apiUrl}/estadisticas-completas`, { headers }).subscribe(
      (data) => {

        this.movimientosMensuales = this.getAllMonths();


        const apiData = data.movimientosMensuales || [];
        apiData.forEach((apiMonth) => {
          const monthIndex = this.movimientosMensuales.findIndex(
            (m) => m.NombreMes.toLowerCase() === apiMonth.NombreMes.toLowerCase()
          );
          if (monthIndex !== -1) {
            this.movimientosMensuales[monthIndex] = {
              ...this.movimientosMensuales[monthIndex],
              Mes: apiMonth.Mes,
              TotalMovimientos: apiMonth.TotalMovimientos
            };
          }
        });
      },
      (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.errorMessage = 'No se pudieron cargar las estadísticas. Por favor, intenta de nuevo.';

        this.movimientosMensuales = this.getAllMonths();
      }
    );
  }

  calcularAlturaBarra(valor: number): number {
    if (this.movimientosMensuales.length === 0) return 0;
    const max = Math.max(...this.movimientosMensuales.map((m) => m.TotalMovimientos), 1);
    return (valor / max) * 100;
  }

  obtenerNombreMesCorto(nombreMes: string): string {
    const meses: { [key: string]: string } = {
      January: 'Ene',
      February: 'Feb',
      March: 'Mar',
      April: 'Abr',
      May: 'May',
      June: 'Jun',
      July: 'Jul',
      August: 'Ago',
      September: 'Sep',
      October: 'Oct',
      November: 'Nov',
      December: 'Dic'
    };
    return meses[nombreMes] || nombreMes.substring(0, 3);
  }

  toRoute(pagina: string | undefined | null): string | null {
    if (!pagina) return null;
    const base = pagina.replace('.html', '').toLowerCase();
    const map: Record<string, string> = {
      empresa: 'empresas',
      sucursal: 'sucursales',
      genero: 'generos',
      rol: 'roles',
      estatususuario: 'estatus-usuario',
      opcion: 'opciones',
      modulo: 'modulos',
      menu: 'menus',
      usuario: 'usuarios',
      'role-opcion': 'role-opcion',
      persona: 'personas',
      tipos_documento: 'tipos_documento',
      estado_civil: 'estado_civil',
      tipo_movimiento_cxc: 'tipo_movimiento_cxc',
      tipo_saldo_cuenta: 'tipo_saldo_cuenta',
      saldo_cuenta: 'saldo_cuenta',
      Cierre_Mes: 'cierremes'
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
