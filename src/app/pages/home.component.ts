import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  benefits = [
    { title: 'Rápido', desc: 'Lanza tu sitio web en tiempo récord con nuestra interfaz amigable.', icon: '⚡' },
    { title: 'Personalizable', desc: 'Adapta cada detalle a tu gusto con opciones flexibles y sencillas.', icon: '🎨' },
    { title: 'Sin Código', desc: 'Crea sin necesidad de conocimientos técnicos, solo tu creatividad.', icon: '�' }
  ];

  processSteps = [
    { 
      title: 'Elige tu plantilla', 
      desc: 'Selecciona entre nuestros diseños profesionales o comienza desde cero.', 
      icon: '💬' 
    },
    { 
      title: 'Personaliza tu diseño', 
      desc: 'Ajusta colores, fuentes, imágenes y contenido con nuestro editor visual.', 
      icon: '⚡' 
    },
    { 
      title: 'Añade tu contenido', 
      desc: 'Agrega textos, imágenes, videos y todo lo que necesites para tu sitio.', 
      icon: '🌐' 
    },
    { 
      title: 'Publica tu web', 
      desc: 'Con un clic, tu sitio estará en línea y listo para el mundo.', 
      icon: '🚀' 
    }
  ];

  stats = [
    { number: '< 2min', label: 'Tiempo promedio de creación' },
    { number: '99.9%', label: 'Uptime garantizado' },
    { number: '500+', label: 'Sitios web generados' },
    { number: '4.9/5', label: 'Satisfacción del cliente' }
  ];

  templates = [
    {
      name: 'Landing Page',
      desc: 'Atrae a tus visitantes con una primera impresión que convierte.',
      image: 'landing-preview.jpg'
    },
    {
      name: 'Portfolio',
      desc: 'Muestra tu trabajo profesional de manera elegante.',
      image: 'portfolio-preview.jpg'
    }
  ];

  testimonials = [
    {
      text: 'POLYLINE me permitió crear mi sitio web en una tarde, sin complicaciones.',
      author: 'Sofia Martinez, Emprendedora'
    },
    {
      text: 'La personalización es increíble, pude adaptar todo a mi marca.',
      author: 'Carlos López, Diseñador'
    }
  ];
}
