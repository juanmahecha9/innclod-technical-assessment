import { Component } from '@angular/core';
import { Util } from '../../shared/util';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(public util: Util) {}
}
