import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartServ } from '../../../services/cart-serv';
import { FavServ } from '../../../services/fav-serv';
import { ProductServ } from '../../../services/product-serv';
import { signal } from '@angular/core';

@Component({
  selector: 'app-favourites',
  imports: [CommonModule, RouterLink],
  templateUrl: './favourites.html',
  styleUrl: './favourites.css',
})
export class  FavouritesComponent {

  private favServ = inject(FavServ);
  private cartServ = inject(CartServ);
  private productServ = inject(ProductServ);

  favIds = this.favServ.favlist;

  fullFavList = signal<any[]>([]);

  constructor() {
    this.loadFavProducts();
  }

  loadFavProducts() {
    this.productServ.getProduct().subscribe((products) => {
      const ids = this.favServ.favlist();

      const mapped = ids
        .map((fav) => products.find((p) => p.id === fav.id))
        .filter((x) => x);

      this.fullFavList.set(mapped);
    });
  }

  removeFromFav(productId: number) {
    this.favServ.addToFav(productId);
    this.loadFavProducts(); 
  }

  addToCart(productId: number) {
    this.cartServ.addtocart(productId, 1);
    alert('Product added to cart!');
  }

  clearFav() {
    if (confirm('Are you sure you want to clear all favourites?')) {
      this.favServ.favlist.set([]);
      this.fullFavList.set([]);
    }
  }
}