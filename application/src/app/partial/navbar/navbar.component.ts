import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Util } from '../../shared/util';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(public util: Util, private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    this.util.GoTo('/login', {});
  }
}
