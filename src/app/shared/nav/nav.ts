import { Component, effect, inject, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { ProductServ } from '../../services/product-serv';
import { CartServ } from '../../services/cart-serv';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  isOpenMenu = signal(false);
  activeDropdownMenu = signal<string | null>(null);

  openToggle() {
    this.isOpenMenu.set(!this.isOpenMenu());
  }

  setDropdownMenu(menu: string | null) {
    if (menu == this.activeDropdownMenu()) this.activeDropdownMenu.set(null);
    else this.activeDropdownMenu.set(menu);
  }
}
