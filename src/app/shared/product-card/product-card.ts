import { Component, inject, input, OnInit, signal } from '@angular/core';
import { product } from '../../types/product';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServ } from '../../services/product-serv';
import { CartServ } from '../../services/cart-serv';

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

  addTocart(id: number, quantity: string) {
    this.cartServ.addtocart(id, +quantity);
  }

  ///////////////quantity of cart product ///////////////
  quantityNum = signal<number>(1);
  decQuantity(quantity: any) {
    console.log(quantity);
    if (+quantity <= 0) {
      return;
    } else {
      this.quantityNum.set(Number(+quantity - 1));
    }
  }
  incQuantity(quantity: any) {
    if (+quantity >= 10) {
      return;
    } else {
      this.quantityNum.set(Number(+quantity + 1));
    }
  }

  /////////////////discount ////////////
  perdiscout = signal<number>(0);

  ngOnInit(): void {
    this.perdiscout.set(
      ((this.productdata()!.price - this.productdata()!.discountPrice) * 100) / 100
    );
  }
}
