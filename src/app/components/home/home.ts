import { Component, inject, signal } from '@angular/core';
import { ProductServ } from '../../services/product-serv';
import { product } from '../../types';
import { ProductCard } from '../../shared/product-card/product-card';
import { TheproductServ } from '../../services/theproduct-serv';
import { theproduct } from '../../thetypes';

@Component({
  selector: 'app-home',
  imports: [ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  productserv = inject(ProductServ);
  // allProducts = signal<product[]>([]);
  featuredProducts = signal<product[]>([]);
  getfeaturedproduct = this.productserv.getfeatureProduct().subscribe((res) => {
    this.featuredProducts.set(res);
    console.log(res[0].stock);
  });

  ////////////////for testing //////////////////
  theproductserv = inject(TheproductServ);
  theallProducts = signal<theproduct[]>([]);
  theget = this.theproductserv.getProduct().subscribe((res) => {
    this.theallProducts.set(res);
    console.log(res);
  });
}
