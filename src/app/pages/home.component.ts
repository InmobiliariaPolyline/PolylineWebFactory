import { Component, ViewChild, ElementRef, AfterViewInit, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { TEMPLATES, TemplateMeta } from '../templates/templates.data';
import { PreviewRegistryService } from '../templates/preview/preview-registry.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('presentationVideo') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('previewHost', { read: ViewContainerRef }) previewHost!: ViewContainerRef;
  
  // Video state
  isPlaying = false;
  isMuted = false;
  currentTime = 0;
  duration = 0;
  progress = 0;
  volume = 100;
  
  // Modal state
  isModalOpen = false;
  selectedTemplate: TemplateMeta | null = null;
  currentView: 'desktop' | 'mobile' = 'desktop';

  // Carousel state
  currentSlide = 0;
  isTransitioning = false;

  constructor(
    private router: Router,
    private previewRegistry: PreviewRegistryService
  ) {}

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

  templates = TEMPLATES;

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

  ngAfterViewInit() {
    if (this.videoRef) {
      const video = this.videoRef.nativeElement;
      video.addEventListener('loadedmetadata', () => {
        this.duration = video.duration;
      });
    }
  }

  onVideoPlay() {
    this.isPlaying = true;
  }

  onVideoPause() {
    this.isPlaying = false;
  }

  onVideoLoaded() {
    if (this.videoRef) {
      this.duration = this.videoRef.nativeElement.duration;
    }
  }

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  // Carousel methods
  get totalSlides(): number {
    return this.templates.length;
  }

  get extendedTemplates(): TemplateMeta[] {
    // Triplicar templates para efecto infinito suave
    return [...this.templates, ...this.templates, ...this.templates];
  }

  get transformValue(): string {
    // Calcular el desplazamiento considerando el offset inicial
    const offset = this.templates.length; // Empezamos en el set del medio
    const totalIndex = offset + this.currentSlide;
    return `translateX(calc(-${totalIndex} * (33.333% + 10px)))`;
  }

  nextSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentSlide++;
    
    setTimeout(() => {
      // Si llegamos al final del primer set, reseteamos al inicio sin animación
      if (this.currentSlide >= this.templates.length) {
        // Desactivar transición temporalmente
        const grid = document.querySelector('.templates-grid') as HTMLElement;
        if (grid) {
          grid.style.transition = 'none';
        }
        
        this.currentSlide = 0;
        
        // Reactivar transición después de un frame
        setTimeout(() => {
          if (grid) {
            grid.style.transition = '';
          }
        }, 50);
      }
      this.isTransitioning = false;
    }, 500);
  }

  prevSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    if (this.currentSlide === 0) {
      // Desactivar transición
      const grid = document.querySelector('.templates-grid') as HTMLElement;
      if (grid) {
        grid.style.transition = 'none';
      }
      
      this.currentSlide = this.templates.length - 1;
      
      // Reactivar transición
      setTimeout(() => {
        if (grid) {
          grid.style.transition = '';
        }
        this.currentSlide--;
        setTimeout(() => {
          this.isTransitioning = false;
        }, 500);
      }, 50);
    } else {
      this.currentSlide--;
      setTimeout(() => {
        this.isTransitioning = false;
      }, 500);
    }
  }

  goToSlide(index: number) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentSlide = index;
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }

  startAutoPlay() {
    setInterval(() => {
      if (!this.isTransitioning) {
        this.nextSlide();
      }
    }, 4000);
  }

  stopAutoPlay() {
    // Auto-play continuo
  }

  onMouseEnter() {
    // Mantener vacío si quieres que continúe
  }

  onMouseLeave() {
    // Mantener vacío
  }

  // Video control methods
  playVideo() {
    if (this.videoRef) {
      this.videoRef.nativeElement.play();
      this.isPlaying = true;
    }
  }

  togglePlayPause() {
    if (this.videoRef) {
      const video = this.videoRef.nativeElement;
      if (video.paused) {
        video.play();
        this.isPlaying = true;
      } else {
        video.pause();
        this.isPlaying = false;
      }
    }
  }

  onVideoEnded() {
    this.isPlaying = false;
    this.progress = 0;
    this.currentTime = 0;
  }

  onTimeUpdate() {
    if (this.videoRef) {
      const video = this.videoRef.nativeElement;
      this.currentTime = video.currentTime;
      this.progress = (video.currentTime / video.duration) * 100;
    }
  }

  seekTo(event: MouseEvent) {
    if (this.videoRef) {
      const video = this.videoRef.nativeElement;
      const progressBar = event.currentTarget as HTMLElement;
      const rect = progressBar.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * video.duration;
      
      video.currentTime = newTime;
      this.currentTime = newTime;
      this.progress = percentage * 100;
    }
  }

  toggleMute() {
    if (this.videoRef) {
      const video = this.videoRef.nativeElement;
      video.muted = !video.muted;
      this.isMuted = video.muted;
    }
  }

  setVolume(event: Event) {
    if (this.videoRef) {
      const target = event.target as HTMLInputElement;
      const volumeValue = parseInt(target.value);
      const video = this.videoRef.nativeElement;
      
      video.volume = volumeValue / 100;
      this.volume = volumeValue;
      this.isMuted = volumeValue === 0;
    }
  }

  toggleFullscreen() {
    if (this.videoRef) {
      const video = this.videoRef.nativeElement;
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
      } else if ((video as any).msRequestFullscreen) {
        (video as any).msRequestFullscreen();
      }
    }
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Modal methods
  async openTemplatePreview(template: TemplateMeta) {
    this.selectedTemplate = template;
    this.isModalOpen = true;
    this.currentView = 'desktop';
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Load preview component dynamically
    if (this.previewHost) {
      await this.previewRegistry.createIn(this.previewHost, template.type, template);
    }
  }

  closeModal(event?: Event) {
    if (event && event.target !== event.currentTarget) return;
    
    this.isModalOpen = false;
    this.selectedTemplate = null;
    // Clear preview host
    if (this.previewHost) {
      this.previewHost.clear();
    }
    // Restore body scroll
    document.body.style.overflow = 'auto';
  }

  setView(view: 'desktop' | 'mobile') {
    this.currentView = view;
  }

  getTemplateUrl(template: TemplateMeta | null): string {
    if (!template) return '';
    return template.slug + '.com';
  }

  viewFullDemo() {
    if (this.selectedTemplate) {
      this.router.navigate(['/plantilla', this.selectedTemplate.slug]);
      this.closeModal();
    }
  }
}
