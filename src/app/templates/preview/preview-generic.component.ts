// src/app/templates/preview/preview-generic.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateMeta } from '../templates.data';

@Component({
  selector: 'app-preview-generic',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preview-generic">
      <header class="header">
        <div class="logo">{{ data?.name }}</div>
        <nav class="nav">
          <a>Inicio</a>
          <a>Servicios</a>
          <a>Acerca</a>
          <a>Contacto</a>
        </nav>
      </header>
      
      <section class="hero">
        <div class="hero-overlay">
          <h1>{{ data?.name }}</h1>
          <p>{{ data?.desc }}</p>
          <button class="cta">Más Información</button>
        </div>
      </section>
      
      <section class="content">
        <h2>Nuestros Servicios</h2>
        <div class="services-grid">
          <div class="service-card" *ngFor="let feature of data?.features">
            <div class="service-icon">●</div>
            <h3>{{ feature }}</h3>
            <p>Ofrecemos soluciones profesionales adaptadas a tus necesidades</p>
          </div>
        </div>
      </section>
      
      <section class="info">
        <div class="info-content">
          <h2>Acerca de Nosotros</h2>
          <p>Somos una empresa comprometida con la excelencia y la satisfacción del cliente.</p>
          <p>Nuestro equipo de profesionales está listo para ayudarte a alcanzar tus objetivos.</p>
        </div>
        <div class="info-image"></div>
      </section>
      
      <section class="cta-section">
        <h2>¿Listo para Comenzar?</h2>
        <p>Contáctanos hoy y descubre cómo podemos ayudarte</p>
        <button class="cta-btn">Contactar Ahora</button>
      </section>
    </div>
  `,
  styles: [`
    .preview-generic {
      font-family: system-ui, -apple-system, sans-serif;
      background: #fff;
      min-height: 100%;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #2c3e50;
      color: white;
    }
    
    .logo {
      font-weight: bold;
      font-size: 1.3rem;
    }
    
    .nav {
      display: flex;
      gap: 1.5rem;
    }
    
    .nav a {
      color: white;
      text-decoration: none;
      cursor: pointer;
      transition: opacity 0.3s;
    }
    
    .nav a:hover {
      opacity: 0.8;
    }
    
    .hero {
      background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
      color: white;
      padding: 5rem 2rem;
      text-align: center;
      position: relative;
    }
    
    .hero-overlay {
      position: relative;
      z-index: 1;
    }
    
    .hero h1 {
      font-size: 3rem;
      margin: 0 0 1rem;
    }
    
    .hero p {
      font-size: 1.3rem;
      margin: 0 0 2rem;
      opacity: 0.95;
    }
    
    .cta {
      background: white;
      color: #2c3e50;
      border: none;
      padding: 1rem 2.5rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      font-size: 1rem;
    }
    
    .content {
      padding: 4rem 2rem;
    }
    
    .content h2 {
      text-align: center;
      font-size: 2.5rem;
      margin: 0 0 3rem;
      color: #2c3e50;
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .service-card {
      padding: 2rem;
      text-align: center;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      transition: box-shadow 0.3s;
    }
    
    .service-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .service-icon {
      font-size: 3rem;
      color: #3498db;
      margin-bottom: 1rem;
    }
    
    .service-card h3 {
      margin: 1rem 0 0.5rem;
      color: #2c3e50;
    }
    
    .service-card p {
      color: #666;
      line-height: 1.6;
    }
    
    .info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      padding: 4rem 2rem;
      background: #f8f9fa;
      align-items: center;
    }
    
    .info-content h2 {
      font-size: 2.5rem;
      margin: 0 0 1.5rem;
      color: #2c3e50;
    }
    
    .info-content p {
      font-size: 1.1rem;
      color: #666;
      line-height: 1.8;
      margin: 0 0 1rem;
    }
    
    .info-image {
      background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
      border-radius: 8px;
      min-height: 300px;
    }
    
    .cta-section {
      padding: 4rem 2rem;
      text-align: center;
      background: #2c3e50;
      color: white;
    }
    
    .cta-section h2 {
      font-size: 2.5rem;
      margin: 0 0 1rem;
    }
    
    .cta-section p {
      font-size: 1.2rem;
      margin: 0 0 2rem;
      opacity: 0.9;
    }
    
    .cta-btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 1rem 3rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      font-size: 1.1rem;
    }
    
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
      }
      
      .nav {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .hero h1 {
        font-size: 2rem;
      }
      
      .info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PreviewGenericComponent {
  @Input() data?: TemplateMeta;
}
