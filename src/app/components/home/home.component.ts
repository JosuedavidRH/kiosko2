

// src/app/components/home/home.component.ts


import { Component, HostListener, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router'; // 🔹 Importar Router para redirigir

import { TemporizadorService } from '../../services/temporizador.service';
import { ContenedoresPaginaPrincipalComponent } from '../contenedores-pagina-principal/contenedores-pagina-principal.component';
import { BotonPrincipalComponent } from '../boton-principal/boton-principal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ContenedoresPaginaPrincipalComponent,
    BotonPrincipalComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  faClock = faClock;

  user = signal<string | null>(null);
  apartmentNumber = signal<string | null>(null);

  clicked = signal(false);
  clickCount = signal(0);
  isProcessing = signal(false);

  factura1Terminada = signal(false);
  factura2Terminada = signal(false);
  factura3Terminada = signal(false);

  temporizador = inject(TemporizadorService);
  private router = inject(Router); // 🔹 Inyectar router

  constructor() {
    // 🔹 Recuperar valores de localStorage
    this.clickCount.set(Number(localStorage.getItem('clickCount') || 0));
    this.clicked.set(localStorage.getItem('clicked') === 'true');
    this.factura1Terminada.set(localStorage.getItem('factura1Terminada') === 'true');
    this.factura2Terminada.set(localStorage.getItem('factura2Terminada') === 'true');
    this.factura3Terminada.set(localStorage.getItem('factura3Terminada') === 'true');

    // 🔹 Recuperar usuario y apto si ya existe
    this.user.set(localStorage.getItem('username'));
    this.apartmentNumber.set(localStorage.getItem('apartmentNumber'));

    // ✅ Si no hay sesión → volver al login
    if (!this.user() || !this.apartmentNumber()) {
      console.warn('⚠️ No hay sesión activa, redirigiendo a login...');
      this.router.navigate(['/login']);
    }

    // 🔹 Efectos para guardar en localStorage cuando cambian los signals
    effect(() => {
      localStorage.setItem('clickCount', this.clickCount().toString());
    });

    effect(() => {
      localStorage.setItem('clicked', this.clicked().toString());
    });

    effect(() => {
      localStorage.setItem('factura1Terminada', this.factura1Terminada().toString());
    });

    effect(() => {
      localStorage.setItem('factura2Terminada', this.factura2Terminada().toString());
    });

    effect(() => {
      localStorage.setItem('factura3Terminada', this.factura3Terminada().toString());
    });
  }

  ngOnInit() {
    // ✅ Solo iniciar si no está corriendo
    if (!this.temporizador.isRunning()) {
      const apto = this.apartmentNumber();
      if (apto) {
        this.temporizador.init(apto, this.temporizador.timeLeft(), 0);
      }
    }
  }

  // -----------------------------
  // 🔹 Métodos de integración React → Angular
  // -----------------------------

  onLogin({ username, apartmentNumber }: { username: string; apartmentNumber: string }) {
    console.log('onLogin ->', username, apartmentNumber);

    this.user.set(username);
    this.apartmentNumber.set(apartmentNumber);

    localStorage.setItem('username', username);
    localStorage.setItem('apartmentNumber', apartmentNumber);

    console.log('localStorage después de onLogin:', localStorage.getItem('apartmentNumber'));
    // El useEffect equivalente ya se maneja con los signals
  }

  onRegister({ username, apartmentNumber }: { username: string; apartmentNumber: string }) {
    console.log('onRegister ->', username, apartmentNumber);

    this.user.set(username);
    this.apartmentNumber.set(apartmentNumber);

    localStorage.setItem('username', username);
    localStorage.setItem('apartmentNumber', apartmentNumber);

    console.log('localStorage después de onRegister:', localStorage.getItem('apartmentNumber'));

    // 🔹 Llamar fetchDatosIniciales inmediatamente
    this.fetchDatosIniciales(apartmentNumber);
  }

  private fetchDatosIniciales(apartmentNumber: string) {
    console.log('📡 fetchDatosIniciales ejecutado para apto:', apartmentNumber);
    // Aquí iría la llamada real al backend
  }

  // -----------------------------
  // 🔹 Lógica de cerrar sesión
  // -----------------------------
  @HostListener('window:beforeunload', ['$event'])
  async beforeUnloadHandler(event: any) {
    this.cerrarSesionGlobal(true);
    event.preventDefault();
    event.returnValue = '';
  }

  async handleCerrarSesion() {
    this.cerrarSesionGlobal(false);
  }

  private async cerrarSesionGlobal(auto: boolean) {
    this.user.set(null);
    this.apartmentNumber.set(null);
    this.clicked.set(false);
    this.clickCount.set(0);
    this.factura1Terminada.set(false);
    this.factura2Terminada.set(false);
    this.factura3Terminada.set(false);

    localStorage.clear();

    if (!auto) {
      this.router.navigate(['/login']); // 🔹 Redirigir al login
    }
  }
}
