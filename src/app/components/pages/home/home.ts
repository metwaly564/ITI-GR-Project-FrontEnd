import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductServ } from '../../../services/product-serv';
import { product } from '../../../types/product';
import { ProductCard } from '../../../shared/product-card/product-card';
import { HeroBanner } from './hero-banner/hero-banner';
import { FeatureSection } from './feature-section/feature-section';
import { HomeServ } from '../../../services/home-serv';
import { Category, Homets } from '../../../types/Homets';
import { Branches } from './branches/branches';
import { Banner } from './banner/banner';
import { CategoriesSection } from './categories-section/categories-section';

@Component({
  selector: 'app-home',
  imports: [
    ProductCard,
    HeroBanner,
    FeatureSection,
    Branches,
    Banner,
    CategoriesSection,
    RouterLink,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  productserv = inject(ProductServ);
  homeServ = inject(HomeServ);
  popularProducts = signal<product[]>([]);
  featuredProducts = signal<product[]>([]);
  allproducts = signal<product[]>([]);
  categories = signal<Category[]>([]);

  homeData = this.homeServ.getHomeData().subscribe((res: Homets) => {
    this.featuredProducts.set(res.featuredProducts);
    this.popularProducts.set(res.popularProducts);
    this.categories.set(res.categories);
  });

  getAllProducts = this.productserv.getProduct().subscribe((res) => {
    const someProduct = res.splice(0, 4);
    this.allproducts.set(someProduct);
    console.log(this.allproducts());
  });
}
