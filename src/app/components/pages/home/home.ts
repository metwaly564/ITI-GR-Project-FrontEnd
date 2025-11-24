import { Component, inject, signal } from '@angular/core';
import { ProductServ } from '../../../services/product-serv';
import { product } from '../../../types/product';
import { ProductCard } from '../../../shared/product-card/product-card';
import { HeroBanner } from './hero-banner/hero-banner';
import { FeatureSection } from './feature-section/feature-section';
import { HomeServ } from '../../../services/home-serv';
import { Category, Homets } from '../../../types/Homets';

@Component({
  selector: 'app-home',
  imports: [ProductCard, HeroBanner, FeatureSection],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  productserv = inject(ProductServ);
  homeServ = inject(HomeServ);
  popularProducts = signal<product[]>([]);
  featuredProducts = signal<product[]>([]);
  categories = signal<Category[]>([]);

  homeData = this.homeServ.getHomeData().subscribe((res: Homets) => {
    console.log(res);

    this.featuredProducts.set(res.featuredProducts);
    this.popularProducts.set(res.popularProducts);
    this.categories.set(res.categories);
  });
}
