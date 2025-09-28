


// src/app/components/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // ✅ Importar FormsModule
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule], // ✅ Agregar FormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  handleSubmit(event: Event) {
    event.preventDefault();
    this.error = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (data: LoginResponse) => {
        if (data.success) {
          console.log('✅ Login exitoso:', data);

          // 🔹 Guardar en localStorage
          localStorage.setItem('username', data.username || this.username);
          localStorage.setItem('apartmentNumber', data.apartmentNumber || '');

          console.log(
            'localStorage después de login:',
            localStorage.getItem('username'),
            localStorage.getItem('apartmentNumber')
          );

          // 🔹 Redirigir al home
          this.router.navigateByUrl('/home'); // ✅ usando navigateByUrl para standalone routing
        } else {
          this.error = data.message || 'Credenciales inválidas';
        }
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        this.error = 'Error de conexión con el servidor';
      }
    });
  }
}
