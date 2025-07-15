import { Component } from '@angular/core';
import { Menu } from '../../components/menu/menu';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-static',
  imports: [Menu, RouterOutlet, RouterLink],
  templateUrl: './static.html',
  styleUrl: './static.scss'
})
export class Static {

}
