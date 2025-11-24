import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  showRegisterButton = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, contraseña } = this.loginForm.value;
    console.log('Intentando login con:', { email, contraseña: '***' });

    // Primero verificar si el usuario existe
    this.usuarioService.verificarEmail(email).subscribe({
      next: (existe) => {
        console.log('Verificación de email:', existe);
        if (existe) {
          // Usuario existe, proceder con login
          this.usuarioService.loginUsuario(email, contraseña).subscribe({
            next: (usuario) => {
              console.log('Respuesta de login:', usuario);
              if (usuario) {
                // Guardar usuario en localStorage
                localStorage.setItem('currentUser', JSON.stringify(usuario));
                console.log('Usuario guardado en localStorage:', usuario);
                console.log('Rol del usuario:', usuario.rol);
                console.log('Usuario activo:', usuario.active);
                alert('Login exitoso');
                console.log('Login exitoso:', usuario);
                this.router.navigate(['/']);
              } else {
                alert('Credenciales inválidas');
                console.error('Credenciales inválidas - usuario null');
              }
            },
            error: (error) => {
              console.error('Error en login:', error);
              console.error('Detalles del error:', JSON.stringify(error, null, 2));
              alert('Error en login: ' + (error?.message || 'Error desconocido') + '. Verifique sus credenciales.');
            }
          });
        } else {
          // Usuario no existe, mostrar botón de registro
          this.showRegisterButton = true;
          alert('Usuario no encontrado. ¿Desea registrarse?');
          console.log('Usuario no encontrado:', email);
        }
      },
      error: (error) => {
        console.error('Error al verificar email:', error);
        console.error('Detalles del error:', JSON.stringify(error, null, 2));
        alert('Error al verificar usuario: ' + (error?.message || 'Error desconocido') + '. Intente nuevamente.');
      }
    });
  }
}