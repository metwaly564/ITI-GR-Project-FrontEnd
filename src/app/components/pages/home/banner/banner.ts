import { Component, inject, signal } from '@angular/core';
import { HomeServ } from '../../../../services/home-serv';
import { BannerTs } from '../../../../types/Homets';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-banner',
  imports: [NgClass],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner {
  homeServ = inject(HomeServ);
  banners = signal<BannerTs[]>([]);
  bannerlength = signal<number>(1);

  currentSlide = 0;
  autoplayInterval: any;

  ngOnInit() {
    this.homeServ.getHomeData().subscribe((res) => {
      const resbanners = res.banners;
      this.banners.set(resbanners);
      this.bannerlength.set(this.banners().length);
    });
    this.startAutoplay();
  }

  nextSlide() {
    this.bannerlength.set(this.banners().length);
    this.currentSlide = (this.currentSlide + 1) % this.bannerlength();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.bannerlength()) % this.bannerlength();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => this.nextSlide(), 3000);
  }

  stopAutoplay() {
    clearInterval(this.autoplayInterval);
  }
}
