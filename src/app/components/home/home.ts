import { Component, inject, signal } from '@angular/core';
import { ProductServ } from '../../services/product-serv';
import { product } from '../../types/product';
import { ProductCard } from '../../shared/product-card/product-card';
import { TheproductServ } from '../../services/theproduct-serv';
import { theproduct } from '../../types/thetypes';
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
  [x: string]: any;
  productserv = inject(ProductServ);
  homeServ = inject(HomeServ);
  //////////feature product //////////////
  featuredProducts = signal<product[]>([]);
  getfeaturedproduct = this.homeServ.getFeatureProduct().subscribe((res: any) => {
    console.log(res);

    return this.featuredProducts.set(res);
  });

  //////////pop product //////////////
  popularProducts = signal<product[]>([]);
  getPopularProduct = this.homeServ.getPopularProduct().subscribe((res: any) => {
    console.log(res);

    return this.popularProducts.set(res);
  });
}
