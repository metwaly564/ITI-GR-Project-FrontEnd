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
      // Filter banners to only show "Main" type (backend should already filter, but double-check)
      const resbanners = res.banners.filter((banner: BannerTs) => !banner.type || banner.type === 'Main');
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

  getBannerImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '';
    // If already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // If it's a relative path starting with /, return as is
    if (imageUrl.startsWith('/')) {
      return `http://localhost:5062${imageUrl}`;
    }
    // If it's just a filename or relative path, construct the full URL
    if (imageUrl.startsWith('images/')) {
      return `http://localhost:5062/${imageUrl}`;
    }
    // If it's just a filename, add the path
    return `http://localhost:5062/images/banners/${imageUrl}`;
  }
}
