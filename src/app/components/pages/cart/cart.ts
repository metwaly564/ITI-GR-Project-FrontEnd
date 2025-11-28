import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { CartServ } from '../../../services/cart-serv';
import { CurrencyPipe } from '@angular/common';
import { ProductServ } from '../../../services/product-serv';


@Component({
  selector: 'app-cart',
  imports: [RouterLink,CurrencyPipe],
  standalone: true,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent {

  private cartServ = inject(CartServ);
  private productServ = inject(ProductServ);

  cartCount = this.cartServ.cartcount;

  cartItemsFromLocal: any[] = [];

  fullCartItems: any[] = [];

  constructor() {
    this.loadCart();
  }

  loadCart() {
    const stored = localStorage.getItem('cart');
    this.cartItemsFromLocal = stored ? JSON.parse(stored) : [];
    this.fullCartItems = [];

    this.cartItemsFromLocal.forEach(item => {
      this.productServ.getProductById(item.id).subscribe(product => {
        this.fullCartItems.push({
          ...product,
          quantity: item.quantity
        });
      });
    });
  }

  increaseQuantity(item: any) {
    this.cartServ.addtocart(item.id, item.quantity + 1);
    this.loadCart();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      this.cartServ.addtocart(item.id, item.quantity - 1);
      this.loadCart();
    }
  }

  removeFromCart(id: number) {
    this.cartServ.addtocart(id, 0);
    this.loadCart();
  }

  getSubtotal(): number {
    return this.fullCartItems.reduce((sum, item) =>
      sum + item.price * item.quantity, 0
    );
  }

  getShipping(): number {
    return this.fullCartItems.length > 0 ? 5 : 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping();
  }
  clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    
    localStorage.removeItem('cart');

    this.cartServ.cartcount.set(0);

    this.fullCartItems = [];
    this.cartItemsFromLocal = [];
  }
}

}