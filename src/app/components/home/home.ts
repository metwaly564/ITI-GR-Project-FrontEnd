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
  productserv = inject(ProductServ);
  homeServ = inject(HomeServ);
  // allProducts = signal<product[]>([]);
  featuredProducts = signal<product[]>([]);
  getfeaturedproduct = this.homeServ.getFeatureProduct().subscribe((res: any) => {
    return this.featuredProducts.set(res);
  });

  ////////////////for testing //////////////////
  theproductserv = inject(TheproductServ);
  theallProducts = signal<theproduct[]>([]);
  theget = this.theproductserv.getProduct().subscribe((res) => {
    this.theallProducts.set(res);
  });
}
