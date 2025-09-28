
//temporizador-factura1.service.ts

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TemporizadorFactura1Service {
  // ⚡ Signal reactivo que reemplaza useState
  timeLeftFactura1 = signal<number>(0);

  private intervalId: any = null; // guardamos el intervalo activo

  constructor() {}

  // Iniciar countdown
  startCountdown(initialTime: number) {
    // 🛑 limpiar cualquier intervalo previo
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.timeLeftFactura1.set(initialTime);

    this.intervalId = setInterval(() => {
      const current = this.timeLeftFactura1();
      if (current > 0) {
        this.timeLeftFactura1.set(current - 1);
      } else {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }, 1000); // ⏱️ exacto 1 segundo
  }

  // Formatear mm:ss
  formatTimeFactura1(seconds: number): string {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }
}
