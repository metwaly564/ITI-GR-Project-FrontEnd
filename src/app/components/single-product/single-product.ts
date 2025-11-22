import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductServ } from '../../services/product-serv';
import { product } from '../../types/product';
import { Location } from '@angular/common';
import { CartServ } from '../../services/cart-serv';

@Component({
  selector: 'app-single-product',
  imports: [RouterLink],
  templateUrl: './single-product.html',
  styleUrl: './single-product.css',
})
export class SingleProduct implements OnInit {
  productServ = inject(ProductServ);
  cartServ = inject(CartServ);
  activeRoute = inject(ActivatedRoute);
  location = inject(Location);

  ProductById = signal<product | null>(null);
  id = signal<number>(0);
  discount = signal<number>(0);
  perdiscount = signal<number>(0);
  quantityNum = signal<number>(1);

  ngOnInit(): void {
    this.id.set(Number(this.activeRoute.snapshot.params['id']));
    this.productServ.getProductById(this.id()).subscribe((res) => {
      this.ProductById.set(res);
      this.discount.set(this.ProductById()!.price - this.ProductById()!.discountPrice);
      this.perdiscount.set(
        ((this.ProductById()!.price - this.ProductById()!.discountPrice) * 100) / 100
      );
    });
  }
  goBack() {
    this.location.back();
  }
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
  addTocart(id: any, quantity: string) {
    this.cartServ.addtocart(id, +quantity);
  }
}
