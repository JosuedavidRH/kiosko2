// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  success: boolean;
  username?: string;
  apartmentNumber?: string;
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  username?: string;
  apartmentNumber?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://backend-1uwd.onrender.com/api' ;

  constructor(private http: HttpClient) {}

  // login
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password });
  }

  // register
  register(username: string, password: string, apartmentNumber: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      username,
      password,
      apartmentNumber
    });
  }
}
