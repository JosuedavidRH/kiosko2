// src/app/services/temporizador.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class TemporizadorService {
  private timeLeftSubject = new BehaviorSubject<number>(43200); // 12 horas
  timeLeft$ = this.timeLeftSubject.asObservable();

  private isRunningSubject = new BehaviorSubject<boolean>(false);
  isRunning$ = this.isRunningSubject.asObservable();

  private fondoRojoSubject = new BehaviorSubject<boolean>(false);
  fondoRojo$ = this.fondoRojoSubject.asObservable();

  private intervalSub?: Subscription;
  private apartmentNumber: string | null = null;
  private statusActual: number = 0;

  constructor() {}

  /** Inicializa el temporizador */
  init(apartmentNumber: string, initialTime = 43200, statusActual = 0) {
    this.apartmentNumber = apartmentNumber;
    this.statusActual = statusActual;

    this.timeLeftSubject.next(initialTime);
    this.fondoRojoSubject.next(false);

    if (initialTime > 0) {
      this.isRunningSubject.next(true);
      this.startInterval();
    } else {
      this.isRunningSubject.next(false);
      this.fondoRojoSubject.next(true);
    }
  }

  /** Arranca o reinicia el contador */
  startCountdown(secondsToRun = 43200) {
    this.stopInterval();

    this.timeLeftSubject.next(secondsToRun);
    this.fondoRojoSubject.next(false);
    this.isRunningSubject.next(true);

    this.startInterval();

    if (this.apartmentNumber) {
      cerrarSesionGlobal({
        auto: false,
        temporizadorPrincipal: secondsToRun,
        userId: this.apartmentNumber,
        statusActual: this.statusActual,
      });
    }
  }

  /** Detiene el contador y guarda estado */
  stopAndPersist() {
    this.stopInterval();
    this.isRunningSubject.next(false);

    if (this.apartmentNumber) {
      cerrarSesionGlobal({
        auto: false,
        temporizadorPrincipal: this.timeLeftSubject.value,
        userId: this.apartmentNumber,
        statusActual: this.statusActual,
      });
    }
  }

  /** Convierte segundos → HH:mm:ss */
  private format(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(
      2,
      '0'
    )}:${String(s).padStart(2, '0')}`;
  }

  // ================== Métodos de acceso ==================
  fondoRojo(): boolean {
    return this.fondoRojoSubject.value;
  }

  isRunning(): boolean {
    return this.isRunningSubject.value;
  }

  timeLeft(): number {
    return this.timeLeftSubject.value;
  }

  formatTimeLeft(): string {
    return this.format(this.timeLeftSubject.value);
  }

  // ================== Privados ==================
  private startInterval() {
    this.intervalSub = interval(1000).subscribe(() => {
      const current = this.timeLeftSubject.value;

      if (current <= 1) {
        this.stopInterval();
        this.timeLeftSubject.next(0);
        this.isRunningSubject.next(false);
        this.fondoRojoSubject.next(true);

        if (this.apartmentNumber) {
          cerrarSesionGlobal({
            auto: false,
            temporizadorPrincipal: 0,
            userId: this.apartmentNumber,
            statusActual: this.statusActual,
          });
        }
      } else {
        this.timeLeftSubject.next(current - 1);
      }
    });
  }

  private stopInterval() {
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
      this.intervalSub = undefined;
    }
  }
}
