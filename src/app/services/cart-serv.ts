import { Injectable } from '@angular/core';
import { ProductCart } from '../types/cart';

@Injectable({
  providedIn: 'root',
})
export class CartServ {
  addtocart(id: number, qunatity: number) {
    const cart = localStorage.getItem('cart');
    const cartarray: ProductCart[] = cart ? JSON.parse(cart) : [];
    const excitingProduct = cartarray.findIndex((item: ProductCart) => item.id === id);

    if (excitingProduct > -1) {
      cartarray[excitingProduct].quantity = qunatity;
    } else {
      cartarray.push({ id: id, quantity: qunatity });
    }

    localStorage.setItem('cart', JSON.stringify(cartarray));
  }
}
