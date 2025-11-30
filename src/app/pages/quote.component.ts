import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Cliente, Direccion } from '../models/cliente.model';
import { Usuario } from '../models/usuario.model';
import { ClienteService } from '../services/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './quote.component.html',
  styleUrl: './quote.component.scss'
})
export class QuoteComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombres:     ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      apellidos:   ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      empresa:     [''],
      documentoIdentidad: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email:       ['', [Validators.required, Validators.email]],
      telefono:    ['', Validators.pattern(/^\d{9}$/)],
      pais:        ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      ciudad:      ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      distrito:    ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      linea:       ['', Validators.required]
    });
  }

  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }


  ngOnInit() {
    // Verificar si viene de registro exitoso y pre-llenar email
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.form.patchValue({
          email: params['email']
        });
      }
    });
  }

  send() {
    this.submitted = true;
    if (this.form.invalid) return;

    // Verificar si el usuario está logueado
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      alert('Debes iniciar sesión para registrar un pedido.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cotizar' } });
      return;
    }

    // Proceder con el registro de cliente
    const cliente: Cliente = {
      nombres: this.form.value.nombres,
      apellidos: this.form.value.apellidos,
      empresa: this.form.value.empresa,
      documentoIdentidad: this.form.value.documentoIdentidad,
      email: this.form.value.email,
      telefono: this.form.value.telefono,
      createdAt: new Date(),
      direccion: {
        pais: this.form.value.pais,
        ciudad: this.form.value.ciudad,
        distrito: this.form.value.distrito,
        linea: this.form.value.linea
      }
    };

    this.clienteService.create(cliente).subscribe({
      next: (response) => {
        alert('Cliente registrado exitosamente');
        console.log('Cliente registrado:', response);
        this.router.navigate(['/pedido'], { queryParams: { clienteId: response.id } });
      },
      error: (error) => {
        console.error('Error al registrar cliente:', error);
        alert('Error al registrar cliente. Inténtelo de nuevo.');
      }
    });
  }
}
