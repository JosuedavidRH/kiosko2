

// src/app/components/temporizador-factura1/temporizador-factura1.component.ts

import { Component, Input, Output, EventEmitter, inject, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemporizadorFactura1Service } from '../../services/temporizador-factura1.service';

@Component({
  selector: 'app-temporizador-factura1',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span style="font-size: 1.5rem; font-weight: bold">
      {{ temporizador.formatTimeFactura1(timeLeft()) }}
    </span>
  `
})
export class TemporizadorFactura1Component implements OnInit {
  @Input() initialTime: number = 0; // segundos
  @Output() finish = new EventEmitter<void>();

  temporizador = inject(TemporizadorFactura1Service);
  timeLeft = this.temporizador.timeLeftFactura1;

  constructor() {
    // 👇 Aquí sí tenemos un contexto de inyección válido
    effect(() => {
      if (this.timeLeft() <= 0 && this.initialTime > 0) {
        this.finish.emit();
      }
    });
  }

  ngOnInit() {
    // 👇 Arrancar temporizador al iniciar
    if (this.initialTime > 0) {
      this.temporizador.startCountdown(this.initialTime);
    }
  }
}
