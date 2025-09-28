// src/app/app.component.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // 👈 aquí ya NO se hace RouterModule.forRoot
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {}
