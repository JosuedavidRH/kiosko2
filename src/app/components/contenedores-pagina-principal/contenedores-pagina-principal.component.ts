// src/app/components/contenedores-pagina-principal/contenedores-pagina-principal.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// 👇 Importamos los componentes hijos que usa este contenedor
import { TemporizadorFactura1Component } from '../temporizador-factura1/temporizador-factura1.component';
import { TemporizadorFactura2Component } from '../temporizador-factura2/temporizador-factura2.component';
import { TemporizadorFactura3Component } from '../temporizador-factura3/temporizador-factura3.component';

@Component({
  selector: 'app-contenedores-pagina-principal',
  standalone: true, // 👈 Ahora es standalone
  imports: [
    CommonModule,
    TemporizadorFactura1Component,
    TemporizadorFactura2Component,
    TemporizadorFactura3Component,
  ],
  templateUrl: './contenedores-pagina-principal.component.html',
  styleUrls: ['./contenedores-pagina-principal.component.css'],
})
export class ContenedoresPaginaPrincipalComponent {
  // ✅ Propiedades recibidas desde el padre
  @Input() clickCount: number = 0;
  @Input() factura1Terminada: boolean = false;
  @Input() factura2Terminada: boolean = false;
  @Input() factura3Terminada: boolean = false;

  // ✅ Eventos que pueden enviar cambios al padre
  @Output() factura1Change = new EventEmitter<boolean>();
  @Output() factura2Change = new EventEmitter<boolean>();
  @Output() factura3Change = new EventEmitter<boolean>();

  // ✅ Ahora también tenemos un Output para clicked
  @Output() clickedChange = new EventEmitter<boolean>();

  // Propiedad interna
  clicked: boolean = false;

  // Métodos internos
  setClicked(value: boolean) {
    this.clicked = value;
    this.clickedChange.emit(value); // ✅ Emitimos al padre un boolean
  }

  setFactura1Terminada(value: boolean) {
    this.factura1Terminada = value;
    this.factura1Change.emit(value);
  }

  setFactura2Terminada(value: boolean) {
    this.factura2Terminada = value;
    this.factura2Change.emit(value);
  }

  setFactura3Terminada(value: boolean) {
    this.factura3Terminada = value;
    this.factura3Change.emit(value);
  }
}
