export interface Pago {
  id: string;
  createdAt: Date;
  estado: string; // pendiente, completado, cancelado, verificado
  metodo: string;
  moneda: string;
  monto: number;
  pedidoId: string;
  proveedorId: string;
  updatedAt: Date;
  datosPago?: any; // Datos adicionales del formulario de pago

  // Campos de verificación
  estadoVerificacion?: 'pendiente' | 'aprobado' | 'rechazado';
  comprobanteUrl?: string; // URL de la imagen del comprobante
  codigoTransaccion?: string; // Código de transacción de Yape/Plin
  notasVerificacion?: string; // Notas del administrador
  verificadoPor?: string; // ID del admin que verificó
  verificadoAt?: Date;
}