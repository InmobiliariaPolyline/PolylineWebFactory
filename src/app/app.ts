import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',     // <-- usamos el html externo
  styleUrl: './app.scss'         // opcional: si tienes estilos del root
})
export class AppComponent {
  // año expuesto para el footer (si lo quieres usar en el html)
  readonly year = signal(new Date().getFullYear());

  // Estado del dropdown
  dropdownOpen = false;

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Cerrar dropdown cuando se hace click fuera
  constructor() {
    document.addEventListener('click', () => {
      this.dropdownOpen = false;
    });
  }
}
