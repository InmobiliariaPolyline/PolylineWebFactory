import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { VentaService } from '../services/venta.service';
import { CategoriaService } from '../services/categoria.service';
import { Usuario } from '../models/usuario.model';
import { Venta } from '../models/venta.model';
import { Categoria } from '../models/categoria.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  // Filtros de tiempo
  fechaInicio: string = '';
  fechaFin: string = '';

  // Métricas
  totalUsuarios: number = 0;
  totalVentas: number = 0;
  totalMontoVentas: number = 0;

  // Datos para gráficos simples
  categoriasVendidas: { nombre: string; cantidad: number }[] = [];
  ventasPorTiempo: { mes: string; monto: number }[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private ventaService: VentaService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargarUsuarios();
    this.cargarVentas();
    this.cargarCategorias();
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      // Si no hay usuarios, usar datos de ejemplo
      this.totalUsuarios = usuarios.length > 0 ? usuarios.length : 156;
    });
  }

  cargarVentas(): void {
    this.ventaService.getAll().subscribe(ventas => {
      const ventasFiltradas = this.filtrarPorFecha(ventas);

      // Si no hay ventas, usar datos de ejemplo
      if (ventasFiltradas.length === 0) {
        this.totalVentas = 87;
        this.totalMontoVentas = 15420.50;

        // Datos de ejemplo para el gráfico de líneas
        this.ventasPorTiempo = [
          { mes: '2024-10', monto: 8500 },
          { mes: '2024-11', monto: 9200 },
          { mes: '2024-12', monto: 11200 },
          { mes: '2025-01', monto: 9800 },
          { mes: '2025-02', monto: 12400 },
          { mes: '2025-03', monto: 15200 }
        ];
      } else {
        this.totalVentas = ventasFiltradas.length;
        this.totalMontoVentas = ventasFiltradas.reduce((sum, venta) => sum + venta.totales.total, 0);
        this.actualizarGraficoVentasPorTiempo(ventasFiltradas);
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.getAll().subscribe(categorias => {
      this.ventaService.getAll().subscribe(ventas => {
        const ventasFiltradas = this.filtrarPorFecha(ventas);
        const categoriasMap = new Map<string, number>();

        // Procesar ventas reales
        ventasFiltradas.forEach(venta => {
          venta.detalles.forEach(detalle => {
            const count = categoriasMap.get(detalle.categoriaId) || 0;
            categoriasMap.set(detalle.categoriaId, count + detalle.cantidad);
          });
        });

        this.categoriasVendidas = [];

        // Si no hay ventas, agregar datos de ejemplo
        if (categoriasMap.size === 0) {
          // Categorías comunes para el negocio
          const categoriasEjemplo = [
            { id: 'crm', nombre: 'CRM', cantidad: 25 },
            { id: 'chatbot', nombre: 'Chatbot IA', cantidad: 18 },
            { id: 'web', nombre: 'Página Web', cantidad: 32 },
            { id: 'ecommerce', nombre: 'E-commerce', cantidad: 15 },
            { id: 'app', nombre: 'App Móvil', cantidad: 12 },
            { id: 'automatizacion', nombre: 'Automatización', cantidad: 8 }
          ];

          this.categoriasVendidas = categoriasEjemplo.map(cat => ({
            nombre: cat.nombre,
            cantidad: cat.cantidad
          }));
        } else {
          // Procesar datos reales
          categoriasMap.forEach((count, categoriaId) => {
            const categoria = categorias.find(c => c.id === categoriaId);
            if (categoria) {
              this.categoriasVendidas.push({
                nombre: categoria.nombre,
                cantidad: count
              });
            }
          });
        }

        // Ordenar por cantidad descendente
        this.categoriasVendidas.sort((a, b) => b.cantidad - a.cantidad);
      });
    });
  }

  filtrarPorFecha(ventas: Venta[]): Venta[] {
    if (!this.fechaInicio && !this.fechaFin) return ventas;

    return ventas.filter(venta => {
      const fechaVenta = new Date(venta.createdAt);

      if (this.fechaInicio && this.fechaFin) {
        const inicio = new Date(this.fechaInicio);
        const fin = new Date(this.fechaFin);
        return fechaVenta >= inicio && fechaVenta <= fin;
      } else if (this.fechaInicio) {
        const inicio = new Date(this.fechaInicio);
        return fechaVenta >= inicio;
      } else if (this.fechaFin) {
        const fin = new Date(this.fechaFin);
        return fechaVenta <= fin;
      }

      return true;
    });
  }

  actualizarGraficoVentasPorTiempo(ventas: Venta[]): void {
    const ventasPorMes = new Map<string, number>();
    ventas.forEach(venta => {
      const fecha = new Date(venta.createdAt);
      const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
      const monto = ventasPorMes.get(mes) || 0;
      ventasPorMes.set(mes, monto + venta.totales.total);
    });

    this.ventasPorTiempo = [];
    Array.from(ventasPorMes.entries()).sort().forEach(([mes, monto]) => {
      this.ventasPorTiempo.push({
        mes,
        monto
      });
    });
  }

  onFechaInicioChange(event: any): void {
    this.fechaInicio = event.target.value;
  }

  onFechaFinChange(event: any): void {
    this.fechaFin = event.target.value;
  }

  aplicarFiltros(): void {
    this.cargarDatos();
  }

  // Métodos para gráficos de barras
  getBarHeight(cantidad: number): number {
    const maxCantidad = Math.max(...this.categoriasVendidas.map(c => c.cantidad));
    return maxCantidad > 0 ? (cantidad / maxCantidad) * 100 : 0;
  }

  getBarGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ];
    return gradients[index % gradients.length];
  }

  getShortName(name: string): string {
    return name.length > 12 ? name.substring(0, 12) + '...' : name;
  }

  // Métodos para gráfico de líneas
  getYAxisLabels(): string[] {
    const maxMonto = Math.max(...this.ventasPorTiempo.map(v => v.monto));
    const labels: string[] = [];
    for (let i = 0; i <= 5; i++) {
      labels.push('S/ ' + Math.round((maxMonto * i) / 5).toLocaleString());
    }
    return labels;
  }

  getYLabelPosition(index: number): number {
    return 220 - (index * 40);
  }

  getAreaPoints(): string {
    if (this.ventasPorTiempo.length === 0) return '';

    let points = '25,220 '; // Punto inicial en la base

    this.ventasPorTiempo.forEach((punto, index) => {
      const x = this.getPointX(index) + 25;
      const y = this.getPointY(punto.monto);
      points += `${x},${y} `;
    });

    points += `${this.getPointX(this.ventasPorTiempo.length - 1) + 25},220`; // Punto final en la base
    return points;
  }

  // Métodos para gráfico de líneas
  getLinePoints(): string {
    if (this.ventasPorTiempo.length === 0) return '';

    const maxMonto = Math.max(...this.ventasPorTiempo.map(v => v.monto));
    const points: string[] = [];

    this.ventasPorTiempo.forEach((punto, index) => {
      const x = this.getPointX(index);
      const y = this.getPointY(punto.monto);
      points.push(`${x},${y}`);
    });

    return points.join(' ');
  }

  getPointX(index: number): number {
    const totalPoints = this.ventasPorTiempo.length;
    if (totalPoints <= 1) return 50;
    return 50 + (index * 300) / (totalPoints - 1);
  }

  getPointY(monto: number): number {
    const maxMonto = Math.max(...this.ventasPorTiempo.map(v => v.monto));
    if (maxMonto === 0) return 150;
    return 150 - (monto / maxMonto) * 120;
  }
}
