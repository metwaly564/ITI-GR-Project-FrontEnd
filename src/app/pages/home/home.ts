import { Component, inject, signal } from '@angular/core';
import { ProductServ } from '../../services/product-serv';
import { product } from '../../types';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  productserv = inject(ProductServ);
  allProducts = signal<product[]>([]);
  get = this.productserv.getProduct().subscribe((res) => {
    this.allProducts.set(res);
  });
}
