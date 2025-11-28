import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { CartServ } from '../../../services/cart-serv';
import { CurrencyPipe } from '@angular/common';
import { ProductServ } from '../../../services/product-serv';
import { signal } from '@angular/core';


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

  cartItemsIds = signal<{ id: number; quantity: number }[]>([]);

  fullCart = signal<any[]>([]);

  constructor() {
    this.loadCart();
  }

  loadCart() {
    const stored = localStorage.getItem('cart');
    const ids = stored ? JSON.parse(stored) : [];
    this.cartItemsIds.set(ids);

    this.productServ.getProduct().subscribe((products) => {
      const full = ids
        .map((c: any) => {
          const product = products.find((p) => p.id === c.id);
          return product
            ? { ...product, quantity: c.quantity }
            : null;
        })
        .filter((x: any) => x);

      this.fullCart.set(full);
    });
  }

  increase(productId: number, quantity: number) {
    this.cartServ.addtocart(productId, quantity + 1);
    this.loadCart();
  }

  decrease(productId: number, quantity: number) {
    if (quantity > 1) {
      this.cartServ.addtocart(productId, quantity - 1);
      this.loadCart();
    }
  }

  remove(productId: number) {
    this.cartServ.addtocart(productId, 0);
    this.loadCart();
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      localStorage.removeItem('cart');
      this.fullCart.set([]);
      this.cartServ.cartcount.set(0);
    }
  }

  
  getSubtotal() {
    return this.fullCart().reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getShipping() {
    return this.fullCart().length > 0 ? 5 : 0;
  }

  getTotal() {
    return this.getSubtotal() + this.getShipping();
  }
}