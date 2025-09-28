import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  // año para el footer
  readonly year = signal(new Date().getFullYear());

  // Estados UI
  dropdownOpen = false;  // submenú "Noticias"
  menuOpen = false;      // panel móvil (hamburguesa)

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;

    // Al abrir el menú móvil, aseguramos que "Noticias" empiece cerrado
    if (this.menuOpen) this.dropdownOpen = false;
  }

  // Cierra menú y dropdown (úsalo en links y backdrop)
  closeAll() {
    this.menuOpen = false;
    this.dropdownOpen = false;
  }

  // Cierre al hacer click fuera
  constructor() {
    document.addEventListener('click', () => this.closeAll());
  }
}
