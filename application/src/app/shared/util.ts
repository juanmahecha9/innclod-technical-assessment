import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Util {
  private router = inject(Router); // Usar inject aquí
  constructor() {}

  public GoTo(segment: string, query: any) {
    this.router.navigate([`/${segment}`], { queryParams: query });
  }

  isAuth() {
    return !!localStorage.getItem('token');
  }
}
