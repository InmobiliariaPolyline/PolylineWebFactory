import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Verificar si el usuario está autenticado
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

    console.log('AuthGuard: Verificando usuario:', user);

    if (user && user.active === true) {
      console.log('AuthGuard: Usuario autenticado válido');
      return true;
    }

    console.log('AuthGuard: Usuario no autenticado');
    // Si no está autenticado, redirigir al login
    this.router.navigate(['/login']);
    return false;
  }
}