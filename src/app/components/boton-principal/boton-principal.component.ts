
// src/app/components/boton-principal/boton-principal.component.ts


import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TemporizadorService } from '../../services/temporizador.service';
import { guardarStatusActual } from '../../utils/guardarStatusActual';

@Component({
  selector: 'app-boton-principal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [disabled]="clickCount === 3 || isProcessing"
      (click)="handleClick()"
      [ngStyle]="{
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        fontSize: '0.8rem',
        backgroundColor:
          clickCount === 1
            ? '#59ff33'
            : clickCount === 2
            ? '#eea82b'
            : clickCount === 3
            ? '#fd531e'
            : '#ff0',
        color: '#000',
        border: 'none',
        cursor: clickCount === 3 || isProcessing ? 'not-allowed' : 'pointer',
        opacity: clickCount === 3 || isProcessing ? 0.6 : 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }"
    >
      <ng-container [ngSwitch]="clickCount">
        <span *ngSwitchCase="0">generar QR</span>
        <span *ngSwitchCase="1">TIENES 2 COMPRAS MAS</span>
        <span *ngSwitchCase="2">TIENES 1 COMPRA MAS</span>
        <span *ngSwitchCase="3">YA NO TIENES MAS COMPRAS</span>
      </ng-container>
    </button>
  `
})
export class BotonPrincipalComponent {
  @Input() clickCount = 0;
  @Output() clickCountChange = new EventEmitter<number>();

  @Input() isProcessing = false;
  @Output() isProcessingChange = new EventEmitter<boolean>();

  @Input() apartmentNumber!: string;
  @Input() initialTime: number = 43200;
  @Input() startCountdown!: () => void;

  constructor(
    private http: HttpClient,
    private router: Router,
    private temporizadorService: TemporizadorService
  ) {}

  async handleClick() {
    this.isProcessingChange.emit(true);

    // 🔹 Siempre leer clickCount actualizado desde localStorage
    const valorActual = Number(localStorage.getItem('clickCount') || this.clickCount);
    const indexToShow = valorActual;

    if (this.startCountdown) {
      this.startCountdown();
    }

    try {
      let codigosBD: string[] = [];

      const data: any = await this.http
        .get(`https://backend-1uwd.onrender.com/api/guardar/recuperar/${apartmentNumber}`)
        .toPromise();

      const hayCodigos = data.success && data.data?.length > 0;

      if (valorActual === 0) {
        if (hayCodigos) {
          codigosBD = data.data.map((item: any) => item.codigo_qr);
        } else {
          codigosBD = Array.from({ length: 3 }, () =>
            Math.floor(100000 + Math.random() * 900000).toString()
          );


          // Guardar en backend
         for (const codigo of codigosBD) {
            const payload = { numero_apto: this.apartmentNumber, codigo_generado: codigo };
          try {
            const response = await this.http
             .post(`https://backend-1uwd.onrender.com/api/guardar`, payload, { responseType: 'text' })
             .toPromise();
             console.log('✅ Guardado en backend:', response);
           } catch (err) {
            console.error('❌ Error guardando código en backend:', err);
           }
          }


          // Guardar temporizador
          const timeLeftLocal = parseInt(localStorage.getItem('timeLeftPrincipal') || '', 10);
          const tiempoARegistrar =
            Number.isFinite(timeLeftLocal) && timeLeftLocal > 0
              ? timeLeftLocal
              : this.initialTime > 0
              ? this.initialTime
              : 43200;

          try {
            const payloadTemp = {
              userId: this.apartmentNumber,
              temporizadorPrincipal: tiempoARegistrar
            };
            await this.http.post(`https://backend-1uwd.onrender.com/api/realTime/temporizador`, payloadTemp).toPromise();
          } catch (err) {
            console.error('❌ Error guardando temporizador:', err);
          }

          this.temporizadorService.startCountdown(tiempoARegistrar);
        }
      } else if (valorActual === 1 || valorActual === 2) {
        if (hayCodigos) {
          codigosBD = data.data.map((item: any) => item.codigo_qr);
        } else {
          console.warn('⚠️ No se encontraron códigos en backend');
        }
      }

      // 🔹 Actualizar clickCount
      const nuevoEstado = (valorActual + 1) % 4;
      this.clickCountChange.emit(nuevoEstado);
      localStorage.setItem('clickCount', nuevoEstado.toString());
      localStorage.setItem('codigos', JSON.stringify(codigosBD));
      localStorage.setItem('indexActual', indexToShow.toString());
      guardarStatusActual(nuevoEstado, this.apartmentNumber);

      // 🔹 Redirigir a segunda página
      if (codigosBD.length > 0) {
        this.router.navigate(['/segunda-pagina'], {
          state: { user: this.apartmentNumber, codigos: codigosBD, indexActual: indexToShow }
        });
      }
    } catch (error) {
      console.error('❌ Error en handleClick:', error);
    }

    this.isProcessingChange.emit(false);
  }
}
