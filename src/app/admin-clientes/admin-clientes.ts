import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente.model';

@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-clientes.html',
  styleUrl: './admin-clientes.scss'
})
export class AdminClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteForm: FormGroup;
  editingCliente: Cliente | null = null;
  showForm = false;

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) {
    this.clienteForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      empresa: ['', Validators.required],
      documentoIdentidad: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      direccion: this.fb.group({
        pais: ['Perú', Validators.required],
        ciudad: ['', Validators.required],
        distrito: ['', Validators.required],
        linea: ['', Validators.required]
      })
    });
  }

  ngOnInit() {
    this.loadClientes();
  }

  loadClientes() {
    console.log('AdminClientes: Iniciando carga de clientes');
    this.clienteService.getAll().subscribe({
      next: (clientes) => {
        console.log('AdminClientes: Clientes cargados exitosamente:', clientes);
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('AdminClientes: Error cargando clientes:', error);
        alert('Error cargando clientes: ' + error.message);
      }
    });
  }

  toggleForm(cliente?: Cliente) {
    this.showForm = !this.showForm;
    if (cliente) {
      this.editingCliente = cliente;
      this.clienteForm.patchValue(cliente);
    } else {
      this.editingCliente = null;
      this.clienteForm.reset({
        direccion: { pais: 'Perú' }
      });
    }
  }

  onSubmit() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const clienteData = this.clienteForm.value;
    console.log('AdminClientes: Procesando formulario:', clienteData);

    if (this.editingCliente) {
      console.log('AdminClientes: Actualizando cliente existente:', this.editingCliente.id);
      this.clienteService.update(this.editingCliente.id!, clienteData).subscribe({
        next: () => {
          console.log('AdminClientes: Cliente actualizado exitosamente');
          alert('Cliente actualizado exitosamente');
          this.loadClientes();
          this.toggleForm();
        },
        error: (error: any) => {
          console.error('AdminClientes: Error actualizando cliente:', error);
          console.error('Detalles del error:', JSON.stringify(error, null, 2));
          alert('Error actualizando cliente: ' + (error?.message || 'Error desconocido'));
        }
      });
    } else {
      console.log('AdminClientes: Creando nuevo cliente');
      this.clienteService.create(clienteData).subscribe({
        next: (result) => {
          console.log('AdminClientes: Cliente creado exitosamente:', result);
          alert('Cliente creado exitosamente');
          this.loadClientes();
          this.toggleForm();
        },
        error: (error: any) => {
          console.error('AdminClientes: Error creando cliente:', error);
          console.error('Detalles del error:', JSON.stringify(error, null, 2));
          alert('Error creando cliente: ' + (error?.message || 'Error desconocido'));
        }
      });
    }
  }

  deleteCliente(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      this.clienteService.delete(id).subscribe({
        next: () => {
          alert('Cliente eliminado exitosamente');
          this.loadClientes();
        },
        error: (error: any) => {
          console.error('Error eliminando cliente:', error);
          alert('Error eliminando cliente: ' + error.message);
        }
      });
    }
  }

  formatDate(date: any): Date {
    if (date && typeof date.toDate === 'function') {
      return date.toDate(); // Es un Timestamp de Firebase
    }
    return date; // Es un Date normal
  }
}