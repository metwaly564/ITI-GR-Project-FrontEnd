import { Component, inject, signal } from '@angular/core';
import { ProductServ } from '../../services/product-serv';
import { product } from '../../types/product';
import { ProductCard } from '../../shared/product-card/product-card';
import { HeroBanner } from './hero-banner/hero-banner';
import { FeatureSection } from './feature-section/feature-section';
import { HomeServ } from '../../services/home-serv';

@Component({
  selector: 'app-home',
  imports: [ProductCard, HeroBanner, FeatureSection],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  productserv = inject(ProductServ);
  homeServ = inject(HomeServ);
  //////////feature product //////////////
  featuredProducts = signal<product[]>([]);
  getfeaturedproduct = this.homeServ.getFeatureProduct().subscribe((res: any) => {
    console.log(res);

    return this.featuredProducts.set(res);
  });

  //////////popular product //////////////
  popularProducts = signal<product[]>([]);
  getPopularProduct = this.homeServ.getPopularProduct().subscribe((res: any) => {
    console.log(res);

    return this.popularProducts.set(res);
  });

  //////////// carsoul ////////////
  slides = [
    { image: 'https://picsum.photos/800/400?1' },
    { image: 'https://picsum.photos/800/400?2' },
    { image: 'https://picsum.photos/800/400?3' },
  ];

  currentIndex = signal(0);

  next() {
    if (this.currentIndex() == this.slides.length - 1) {
      this.currentIndex.set(0);
    }
    this.currentIndex.set((this.currentIndex() + 1) % this.slides.length);
    console.log(this.currentIndex);
    console.log(this.slides.length);
  }

  prev() {
    this.currentIndex.set((this.currentIndex() - 1 + this.slides.length) % this.slides.length);
  }
}
