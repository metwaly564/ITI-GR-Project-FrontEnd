import { Component, inject, input, OnInit, signal } from '@angular/core';
import { product } from '../../types/product';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartServ } from '../../services/cart-serv';
import { ProductCart } from '../../types/cart';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard implements OnInit {
  productdata = input.required<product>();
  cartServ = inject(CartServ);
  router = inject(Router);

  goToSingleProductPage(id: number) {
    this.router.navigateByUrl(`/singleproduct/${id}`);
  }

  addTocart(id: number) {
    const productofcart = localStorage.getItem('cart');
    const productofcartarray: ProductCart[] = productofcart ? JSON.parse(productofcart) : [];
    const exsistingproduct = productofcartarray.find((item) => item.id == id);
    this.cartServ.addtocart(id, exsistingproduct ? exsistingproduct.quantity + 1 : 1);
  }

  /////////////////discount ////////////
  perdiscout = signal<number>(0);

  ngOnInit(): void {
    if (this.productdata()?.discountPrice) {
      this.perdiscout.set(
        ((this.productdata()!.price - (this.productdata()?.discountPrice ?? 0)) * 100) / 100
      );
    }
  }
}
