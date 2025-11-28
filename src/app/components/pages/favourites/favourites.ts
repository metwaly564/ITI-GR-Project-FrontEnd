import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartServ } from '../../../services/cart-serv';
import { FavServ } from '../../../services/fav-serv';
import { ProductServ } from '../../../services/product-serv';
import { product } from '../../../types/product';

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
  fullFavList: any[] = [];           

  constructor() {
    this.loadFavProducts();
  }

  loadFavProducts() {
    this.productServ.getProduct().subscribe((allProducts: product[]) => {

      const favIdsArray = this.favIds(); 

      this.fullFavList = allProducts.filter(p =>
        favIdsArray.some(f => f.id === p.id)
      );
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
      const favs = this.favIds();
      favs.forEach(item => this.favServ.addToFav(item.id));
      this.fullFavList = [];
    }
  }
}