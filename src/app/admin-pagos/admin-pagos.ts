import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../services/pago.service';
import { PedidoService } from '../services/pedido.service';
import { Pago } from '../models/pago.model';
import { Pedido } from '../models/pedido.model';

@Component({
  selector: 'app-admin-pagos',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pagos.html',
  styleUrl: './admin-pagos.scss',
})
export class AdminPagos implements OnInit {
  pagos: (Pago & { pedido?: Pedido })[] = [];
  loading = false;
  filtroEstado: string = 'pendiente';
  pagoSeleccionado: Pago | null = null;
  notasVerificacion: string = '';

  constructor(
    private pagoService: PagoService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.loading = true;
    this.pagoService.getAll().subscribe({
      next: (pagos) => {
        // Filtrar por estado de verificación
        let pagosFiltrados = pagos;
        if (this.filtroEstado !== 'todos') {
          pagosFiltrados = pagos.filter(p => p.estadoVerificacion === this.filtroEstado);
        }

        // Cargar información de pedidos para cada pago
        const pagosConPedidos: (Pago & { pedido?: Pedido })[] = [];

        pagosFiltrados.forEach(pago => {
          this.pedidoService.getById(pago.pedidoId).subscribe({
            next: (pedido) => {
              pagosConPedidos.push({ ...pago, pedido });
              // Ordenar por fecha más reciente
              pagosConPedidos.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              this.pagos = [...pagosConPedidos];
            },
            error: (error) => {
              console.error('Error cargando pedido:', error);
              pagosConPedidos.push(pago);
              this.pagos = [...pagosConPedidos];
            }
          });
        });

        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando pagos:', error);
        this.loading = false;
      }
    });
  }

  seleccionarPago(pago: Pago): void {
    this.pagoSeleccionado = pago;
    this.notasVerificacion = pago.notasVerificacion || '';
  }

  aprobarPago(pago: Pago): void {
    if (!this.notasVerificacion.trim()) {
      alert('Por favor ingrese notas de verificación');
      return;
    }

    const actualizacion = {
      estado: 'completado',
      estadoVerificacion: 'aprobado' as 'aprobado',
      notasVerificacion: this.notasVerificacion,
      verificadoPor: 'admin', // Aquí deberías usar el ID del admin actual
      verificadoAt: new Date()
    };

    this.pagoService.update(pago.id, actualizacion).subscribe({
      next: () => {
        alert('Pago aprobado exitosamente');
        this.pagoSeleccionado = null;
        this.notasVerificacion = '';
        this.cargarPagos();
      },
      error: (error) => {
        console.error('Error aprobando pago:', error);
        alert('Error aprobando el pago');
      }
    });
  }

  rechazarPago(pago: Pago): void {
    if (!this.notasVerificacion.trim()) {
      alert('Por favor ingrese el motivo del rechazo');
      return;
    }

    const actualizacion = {
      estado: 'cancelado',
      estadoVerificacion: 'rechazado' as 'rechazado',
      notasVerificacion: this.notasVerificacion,
      verificadoPor: 'admin',
      verificadoAt: new Date()
    };

    this.pagoService.update(pago.id, actualizacion).subscribe({
      next: () => {
        alert('Pago rechazado');
        this.pagoSeleccionado = null;
        this.notasVerificacion = '';
        this.cargarPagos();
      },
      error: (error) => {
        console.error('Error rechazando pago:', error);
        alert('Error rechazando el pago');
      }
    });
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'pendiente': return '#f39c12';
      case 'aprobado': return '#27ae60';
      case 'rechazado': return '#e74c3c';
      default: return '#95a5a6';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'pendiente': return '⏳';
      case 'aprobado': return '✅';
      case 'rechazado': return '❌';
      default: return '❓';
    }
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES');
  }
}
