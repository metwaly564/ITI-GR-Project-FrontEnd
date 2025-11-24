import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartServ } from '../../services/cart-serv';
import { FavServ } from '../../services/fav-serv';
import { HomeServ } from '../../services/home-serv';
import { Category, Homets } from '../../types/home';

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
  favserv = inject(FavServ);
  homeServ = inject(HomeServ);
  categories = signal<Category[]>([]);

  homeData = this.homeServ.getHomeData().subscribe((res: Homets) => {
    this.categories.set(res.categories);
  });

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
