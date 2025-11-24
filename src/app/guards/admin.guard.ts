import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Verificar si el usuario está autenticado, activo y tiene rol de administrador
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

    console.log('AdminGuard: Verificando usuario:', user);
    console.log('AdminGuard: Rol del usuario:', user?.rol);
    console.log('AdminGuard: Usuario activo:', user?.active);

    if (user && user.rol === 'administrador' && user.active === true) {
      console.log('AdminGuard: Usuario administrador válido');
      return true;
    }

    console.log('AdminGuard: Usuario no es administrador o no está activo');
    // Si no es administrador, redirigir al login
    this.router.navigate(['/login']);
    return false;
  }
}