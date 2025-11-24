import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { PagoService } from '../../services/pago.service';
import { Pedido } from '../../models/pedido.model';

interface MetodoPago {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  disponible: boolean;
}

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-gateway.html',
  styleUrl: './payment-gateway.scss'
})
export class PaymentGatewayComponent implements OnInit {
  pedido: Pedido | null = null;
  metodoSeleccionado: string = '';
  loading = false;
  paymentForm: any = {};
  camposPago: any[] = []; // Cache para evitar múltiples llamadas

  metodosPago: MetodoPago[] = [
    {
      id: 'tarjeta_credito',
      nombre: 'Tarjeta de Crédito',
      descripcion: 'Visa, Mastercard, American Express',
      icono: '💳',
      disponible: true
    },
    {
      id: 'tarjeta_debito',
      nombre: 'Tarjeta de Débito',
      descripcion: 'Pago directo desde tu cuenta bancaria',
      icono: '🏦',
      disponible: true
    },
    {
      id: 'transferencia_bancaria',
      nombre: 'Transferencia Bancaria',
      descripcion: 'Transferencia desde tu banco',
      icono: '💰',
      disponible: true
    },
    {
      id: 'yape',
      nombre: 'Yape',
      descripcion: 'Pago rápido con Yape',
      icono: '📱',
      disponible: true
    },
    {
      id: 'plin',
      nombre: 'Plin',
      descripcion: 'Pago instantáneo con Plin',
      icono: '💸',
      disponible: true
    },
    {
      id: 'efectivo',
      nombre: 'Efectivo',
      descripcion: 'Pago en efectivo al momento de entrega',
      icono: '💵',
      disponible: true
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService,
    private pagoService: PagoService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('=== CONSTRUCTOR PaymentGatewayComponent ===');
    console.log('Componente creado correctamente');
  }

  ngOnInit() {
    console.log('=== INICIO ngOnInit PaymentGatewayComponent ===');
    console.log('Parámetros de ruta:', this.route.snapshot.params);

    const pedidoId = this.route.snapshot.params['pedidoId'];
    console.log('Pedido ID extraído:', pedidoId);

    if (pedidoId) {
      console.log('Cargando pedido...');
      this.cargarPedido(pedidoId);
    } else {
      console.error('No se proporcionó ID de pedido');
      this.router.navigate(['/']);
    }

    console.log('=== FIN ngOnInit PaymentGatewayComponent ===');
  }

  cargarPedido(pedidoId: string) {
    console.log('Cargando pedido:', pedidoId);
    this.pedidoService.getById(pedidoId).subscribe({
      next: (pedido) => {
        console.log('Pedido cargado:', pedido);
        this.pedido = pedido;
      },
      error: (error) => {
        console.error('Error cargando pedido:', error);
        alert('Error cargando los detalles del pedido');
        this.router.navigate(['/']);
      }
    });
  }

  onMetodoClick(metodo: MetodoPago) {
    console.log('=== CLICK en método de pago ===');
    console.log('Método clickeado:', metodo);

    try {
      if (!metodo.disponible) {
        console.log('Método no disponible, ignorando click');
        return;
      }

      console.log('Llamando a seleccionarMetodo con ID:', metodo.id);
      this.seleccionarMetodo(metodo.id);
      console.log('=== FIN CLICK en método de pago ===');

    } catch (error) {
      console.error('ERROR en onMetodoClick:', error);
    }
  }

  seleccionarMetodo(metodoId: string) {
    console.log('=== INICIO seleccionarMetodo ===');
    console.log('Método ID recibido:', metodoId);
    console.log('Método seleccionado anterior:', this.metodoSeleccionado);

    try {
      this.metodoSeleccionado = metodoId;
      this.paymentForm = {}; // Reset form data

      console.log('Método de pago establecido:', this.metodoSeleccionado);
      console.log('Formulario reseteado:', this.paymentForm);

      // Actualizar cache de campos para evitar múltiples llamadas
      this.camposPago = this.getCamposPagoInternal();
      console.log('Campos cacheados para método:', this.camposPago.length, this.camposPago);

      // Forzar detección de cambios
      console.log('Forzando detección de cambios...');
      this.cdr.detectChanges();
      console.log('Detección de cambios completada');

    } catch (error) {
      console.error('ERROR en seleccionarMetodo:', error);
    }

    console.log('=== FIN seleccionarMetodo ===');
  }

  getCamposPagoInternal(): any[] {
    console.log('=== getCamposPagoInternal llamado ===');
    console.log('metodoSeleccionado actual:', this.metodoSeleccionado);

    let campos: any[] = [];

    switch (this.metodoSeleccionado) {
      case 'tarjeta_credito':
      case 'tarjeta_debito':
        console.log('Retornando campos para tarjeta');
        campos = [
          { key: 'numeroTarjeta', label: 'Número de Tarjeta', type: 'text', placeholder: '1234 5678 9012 3456', pattern: /^[0-9\s]{13,19}$/, maxLength: 19 },
          { key: 'fechaExpiracion', label: 'Fecha de Expiración', type: 'text', placeholder: 'MM/YY', pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, maxLength: 5 },
          { key: 'cvv', label: 'CVV', type: 'password', placeholder: '123', pattern: /^[0-9]{3,4}$/, maxLength: 4 },
          { key: 'nombreTitular', label: 'Nombre del Titular', type: 'text', placeholder: 'Como aparece en la tarjeta' }
        ];
        break;
      case 'transferencia_bancaria':
        console.log('Retornando campos para transferencia');
        campos = [
          { key: 'bancoOrigen', label: 'Banco Origen', type: 'text', placeholder: 'Ej: BCP, Interbank, BBVA' },
          { key: 'numeroCuenta', label: 'Número de Cuenta', type: 'text', placeholder: 'Cuenta de origen' },
          { key: 'titularCuenta', label: 'Titular de la Cuenta', type: 'text', placeholder: 'Nombre del titular' },
          { key: 'codigoOperacion', label: 'Código de Operación', type: 'text', placeholder: 'Código de la transferencia (opcional)' }
        ];
        break;
      case 'yape':
        console.log('Retornando campos para Yape');
        campos = [
          { key: 'numeroTelefono', label: 'Número de Teléfono', type: 'tel', placeholder: '9XXXXXXXX', pattern: /^[0-9]{9}$/, maxLength: 9 },
          { key: 'codigoVerificacion', label: 'Código de Verificación', type: 'text', placeholder: 'Código enviado por Yape' }
        ];
        break;
      case 'plin':
        console.log('Retornando campos para Plin');
        campos = [
          { key: 'numeroTelefono', label: 'Número de Teléfono', type: 'tel', placeholder: '9XXXXXXXX', pattern: /^[0-9]{9}$/, maxLength: 9 },
          { key: 'codigoVerificacion', label: 'Código de Verificación', type: 'text', placeholder: 'Código enviado por Plin' }
        ];
        break;
      case 'efectivo':
        console.log('Retornando campos para efectivo');
        campos = [
          { key: 'instrucciones', label: 'Instrucciones Especiales', type: 'textarea', placeholder: 'Ej: Llamar al timbre, entregar en recepción, etc.' }
        ];
        break;
      default:
        console.log('Método no reconocido, retornando array vacío');
        campos = [];
    }

    console.log('Campos retornados:', campos.length, campos);
    console.log('=== FIN getCamposPagoInternal ===');
    return campos;
  }

  getCamposPago(): any[] {
    // Retornar cache para evitar múltiples llamadas desde el template
    return this.camposPago;
  }

  confirmarPago() {
    console.log('=== INICIO confirmarPago ===');
    console.log('Método seleccionado:', this.metodoSeleccionado);
    console.log('Pedido:', this.pedido);
    console.log('Formulario de pago:', this.paymentForm);

    if (!this.metodoSeleccionado) {
      console.log('ERROR: No hay método seleccionado');
      alert('Por favor selecciona un método de pago');
      return;
    }

    if (!this.pedido) {
      console.log('ERROR: No hay pedido');
      alert('Error: No se encontró el pedido');
      return;
    }

    // Validar campos requeridos según el método de pago
    console.log('Obteniendo campos requeridos desde cache...');
    const camposRequeridos = this.camposPago;
    console.log('Campos requeridos:', camposRequeridos);

    const camposFaltantes = camposRequeridos.filter(campo => {
      const valor = this.paymentForm[campo.key];
      const estaVacio = !valor || valor.trim() === '';
      console.log(`Campo ${campo.key}: "${valor}" - Está vacío: ${estaVacio}`);
      return estaVacio;
    });

    console.log('Campos faltantes:', camposFaltantes);

    if (camposFaltantes.length > 0) {
      console.log('ERROR: Campos faltantes detectados');
      alert(`Por favor completa todos los campos requeridos: ${camposFaltantes.map(c => c.label).join(', ')}`);
      return;
    }

    // Validar formatos
    console.log('Validando formatos...');
    const camposInvalidos = camposRequeridos.filter(campo => {
      if (!campo.pattern) return false;
      const esValido = campo.pattern.test(this.paymentForm[campo.key]);
      console.log(`Campo ${campo.key}: formato válido = ${esValido}`);
      return !esValido;
    });

    console.log('Campos inválidos:', camposInvalidos);

    if (camposInvalidos.length > 0) {
      console.log('ERROR: Campos con formato inválido');
      alert(`Algunos campos tienen formato inválido: ${camposInvalidos.map(c => c.label).join(', ')}`);
      return;
    }

    console.log('Iniciando procesamiento de pago...');
    this.loading = true;

    // Crear el pago con datos adicionales
    const pagoData = {
      estado: 'completado', // Cambiar a completado ya que se procesa inmediatamente
      metodo: this.metodoSeleccionado,
      moneda: this.pedido.moneda,
      monto: this.pedido.totales.total,
      pedidoId: this.pedido.id,
      proveedorId: 'default_provider',
      datosPago: this.paymentForm // Incluir todos los datos del formulario
    };

    console.log('Datos del pago a enviar:', pagoData);

    this.pagoService.create(pagoData).subscribe({
      next: (pagoCreado) => {
        console.log('Pago creado exitosamente:', pagoCreado);
        alert(`Pago procesado exitosamente con ${this.getNombreMetodo(this.metodoSeleccionado)}`);
        this.router.navigate(['/venta', this.pedido!.id]);
      },
      error: (error) => {
        console.error('Error procesando pago:', error);
        alert('Error procesando el pago. Inténtalo de nuevo.');
        this.loading = false;
      }
    });

    console.log('=== FIN confirmarPago ===');
  }

  getNombreMetodo(metodoId: string): string {
    const metodo = this.metodosPago.find(m => m.id === metodoId);
    return metodo ? metodo.nombre : metodoId;
  }

  volver() {
    this.router.navigate(['/venta', this.pedido?.id]);
  }

  // Métodos de formateo simplificados - por ahora desactivados para evitar bloqueos
  formatCardNumber(event: any) {
    // Implementación básica sin manipulación directa del DOM
    const value = event?.target?.value || '';
    this.paymentForm.numeroTarjeta = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  }

  formatExpiryDate(event: any) {
    // Implementación básica sin manipulación directa del DOM
    const value = event?.target?.value || '';
    this.paymentForm.fechaExpiracion = value.replace(/\D/g, '');
  }

  isValidField(fieldKey: string): boolean {
    const campo = this.camposPago.find(c => c.key === fieldKey);
    if (!campo || !campo.pattern) return true;
    const value = this.paymentForm[fieldKey];
    return campo.pattern.test(value);
  }

  formatDate(date: any): Date {
    if (date && typeof date.toDate === 'function') {
      return date.toDate();
    }
    return date;
  }
}