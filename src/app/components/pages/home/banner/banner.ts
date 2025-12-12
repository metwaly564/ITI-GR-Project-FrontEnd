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
  bannerlength = signal<number>(0);

  currentSlide = 0;
  autoplayInterval: any;

  ngOnInit() {
    this.homeServ.getHomeData().subscribe({
      next: (res) => {
        // Filter banners to only show "Main" type (backend should already filter, but double-check)
        const resbanners = res.banners?.filter((banner: BannerTs) => !banner.type || banner.type === 'Main') || [];
        this.banners.set(resbanners);
        const length = resbanners.length;
        this.bannerlength.set(length);
        
        // Reset currentSlide if it's out of bounds
        if (this.currentSlide >= length && length > 0) {
          this.currentSlide = 0;
        }
        
        // Preload next image(s) to ensure smooth transitions
        if (length > 1) {
          this.preloadBannerImages(resbanners);
        }
        
        // Only start autoplay if we have banners
        if (length > 0) {
          this.stopAutoplay(); // Stop any existing autoplay
          this.startAutoplay();
        }
      },
      error: (err) => {
        console.error('Error fetching banners:', err);
        this.banners.set([]);
        this.bannerlength.set(0);
      }
    });
  }

  preloadBannerImages(banners: BannerTs[]) {
    // Preload all images for smooth transitions
    setTimeout(() => {
      banners.forEach((banner, index) => {
        const imageUrl = this.getBannerImageUrl(banner.imageUrl);
        if (imageUrl) {
          const img = new Image();
          img.onload = () => {
            console.log(`Banner ${index} image preloaded:`, imageUrl);
          };
          img.onerror = () => {
            console.error(`Banner ${index} image failed to preload:`, imageUrl);
          };
          img.src = imageUrl;
        }
      });
    }, 100);
  }

  nextSlide() {
    const length = this.banners().length;
    if (length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % length;
  }

  prevSlide() {
    const length = this.banners().length;
    if (length === 0) return;
    this.currentSlide = (this.currentSlide - 1 + length) % length;
  }

  goToSlide(index: number) {
    const length = this.banners().length;
    if (length === 0 || index < 0 || index >= length) return;
    this.currentSlide = index;
  }

  startAutoplay() {
    if (this.banners().length === 0) return;
    this.stopAutoplay(); // Clear any existing interval
    this.autoplayInterval = setInterval(() => {
      if (this.banners().length > 0) {
        this.nextSlide();
      }
    }, 3000);
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

  handleImageError(event: Event, imageUrl: string | undefined) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder.jpg';
    if (imageUrl) {
      console.error('Banner image failed to load:', imageUrl);
    }
  }
}
