// src/app/components/register/register.component.ts

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error = '';

  constructor(private authService: AuthService, private router: Router) {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      apartmentNumber: new FormControl('', Validators.required),
    });
  }

  handleSubmit() {
    if (this.registerForm.invalid) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    const { username, password, apartmentNumber } = this.registerForm.value;

    this.authService.register(username, password, apartmentNumber).subscribe({
      next: (data) => {
        if (data.success) {
          // 🔹 Guardar usuario y apartamento en localStorage
          localStorage.setItem('username', data.username || username);
          localStorage.setItem('apartmentNumber', data.apartmentNumber || apartmentNumber);

          console.log(
            '✅ Registro exitoso:',
            localStorage.getItem('username'),
            localStorage.getItem('apartmentNumber')
          );

          // 🔹 Redirigir directamente al home
          this.router.navigateByUrl('/home');
        } else {
          this.error = data.message || 'No se pudo registrar';
        }
      },
      error: (err) => {
        console.error('❌ Error en registro:', err);
        this.error = 'Error de conexión con el servidor';
      }
    });
  }
}
