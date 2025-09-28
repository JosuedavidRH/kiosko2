// src/app/segunda-pagina/segunda-pagina.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { restaurarDatos2, DatosRestaurados } from '../../utils/restaurarDatos2';

@Component({
  selector: 'app-segunda-pagina',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './segunda-pagina.component.html',
  styleUrls: ['./segunda-pagina.component.css'],
})
export class SegundaPaginaComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);

  user = signal<string | null>(null);
  codigos = signal<string[]>([]);
  indexActual = signal(0);

  ngOnInit(): void {
    const state = window.history.state;
    const localUser = localStorage.getItem('user');
    const userFromState = state?.user;

    this.user.set(userFromState || localUser);

    if (!this.user()) {
      this.router.navigate(['/']);
      return;
    }

    this.cargarDatos(); // ✅ Llamada al método fuera de ngOnInit
  }

  async cargarDatos() {
    try {
      const state = window.history.state;
      const codigosState: string[] = state?.codigos;

      if (codigosState && Array.isArray(codigosState)) {
        this.codigos.set(codigosState);
        this.indexActual.set(0);
        localStorage.setItem('codigos', JSON.stringify(codigosState));
        localStorage.setItem('indexActual', '0');
        return;
      }

      const restaurados = await restaurarDatos2(this.user()!);

      if (restaurados && restaurados.codigos?.length > 0) {
        this.codigos.set(restaurados.codigos);
        this.indexActual.set(0);
        localStorage.setItem('codigos', JSON.stringify(restaurados.codigos));
        localStorage.setItem('indexActual', '0');
      } else {
        const codigosGuardados = JSON.parse(localStorage.getItem('codigos') || '[]');
        const indexGuardado = parseInt(localStorage.getItem('indexActual') || '0', 10);

        if (codigosGuardados.length > 0 && !isNaN(indexGuardado) && indexGuardado < 3) {
          this.codigos.set(codigosGuardados);
          this.indexActual.set(0);
          localStorage.setItem('codigos', JSON.stringify(codigosGuardados));
          localStorage.setItem('indexActual', '0');
        } else {
          const nuevos = this.generarTresCodigos();
          this.codigos.set(nuevos);
          this.indexActual.set(0);
          localStorage.setItem('codigos', JSON.stringify(nuevos));
          localStorage.setItem('indexActual', '0');
        }
      }
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
    }
  }

  generarTresCodigos(): string[] {
    return Array.from({ length: 3 }, () =>
      Math.floor(100000 + Math.random() * 900000).toString()
    );
  }

  manejarVolver() {
    const nuevoIndex = this.indexActual() + 1;

    if (nuevoIndex < 3) {
      this.indexActual.set(nuevoIndex);
      localStorage.setItem('indexActual', nuevoIndex.toString());
    } else {
      const nuevosCodigos = this.generarTresCodigos();
      this.codigos.set(nuevosCodigos);
      this.indexActual.set(0);
      localStorage.setItem('codigos', JSON.stringify(nuevosCodigos));
      localStorage.setItem('indexActual', '0');
    }

    this.router.navigate(['/home']);
  }

  get qrActual(): string | null {
    return this.codigos()[this.indexActual()] || null;
  }
}
