import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { CartServ } from '../../../services/cart-serv';


@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent {
  private cartServ = inject(CartServ);
  private router = inject(Router);

  orderNumber = 'ORD-' + Date.now().toString().slice(-6);

  constructor() {
    // نفرغ الكارت بعد ما نعمل order
    this.clearCart();
  }

  clearCart() {
    // نمسح كل الـ items من الكارت
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    cartItems.forEach((item: any) => {
      this.cartServ.addtocart(item.id, 0);
    });
  }

  backToHome() {
    this.router.navigate(['/home']);
  }
}
