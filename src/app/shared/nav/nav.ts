import { Component, inject, signal, computed, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { CartServ } from '../../services/cart-serv';
import { FavServ } from '../../services/fav-serv';
import { HomeServ } from '../../services/home-serv';
import { ThemeService } from '../../services/theme.service';
import { Auth } from '../../services/auth';
import { NotificationService } from '../../services/notification.service';
import { SearchModal } from '../search-modal/search-modal';
import { Category, Homets } from '../../types/Homets';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, NgClass, SearchModal],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  @ViewChild(SearchModal) searchModal!: SearchModal;
  
  isOpenMenu = signal(false);
  activeDropdownMenu = signal<string | null>(null);
  cartserv = inject(CartServ);
  favserv = inject(FavServ);
  homeServ = inject(HomeServ);
  themeService = inject(ThemeService);
  authService = inject(Auth);
  notificationService = inject(NotificationService);
  categories = signal<Category[]>([]);

  // Computed signal for logo path that reacts to theme changes
  logoPath = computed(() => 
    this.themeService.isDarkMode() 
      ? '/LightLogo.png' 
      : '/assets/images/logo.png'
  );

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

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  openSearch() {
    this.searchModal?.openModal();
  }

  logout() {
    this.notificationService.stopConnection();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
