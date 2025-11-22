
import { Component,  signal } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  isOpenMenu = signal(false);
  activeDropdownMenu = signal<string | null>(null);

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
