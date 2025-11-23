import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartServ } from '../../services/cart-serv';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  isOpenMenu = signal(false);
  activeDropdownMenu = signal<string | null>(null);
  cartserv = inject(CartServ);

  constructor(private router: Router) {}

  openToggle() {
    this.isOpenMenu.set(!this.isOpenMenu());
  }

  setDropdownMenu(menu: string | null) {
    if (menu == this.activeDropdownMenu()) this.activeDropdownMenu.set(null);
    else this.activeDropdownMenu.set(menu);
  }
  goToProfile() {
    this.router.navigate(['/Profile']);
  }
}
