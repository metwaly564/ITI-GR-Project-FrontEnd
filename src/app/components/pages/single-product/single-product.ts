import { Component, computed, effect, inject, OnInit, Signal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductServ } from '../../../services/product-serv';
import { product } from '../../../types/product';
import { Location } from '@angular/common';
import { CartServ } from '../../../services/cart-serv';
import { FavServ } from '../../../services/fav-serv';
import { HomeServ } from '../../../services/home-serv';
import { ProductCard } from '../../../shared/product-card/product-card';
import { CurrencyPipe } from '@angular/common';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.html',
  styleUrls: ['./single-product.css'],
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  imports: [NgClass, ProductCard, CurrencyPipe],
=======
  imports: [ProductCard],
>>>>>>> Stashed changes
=======
  imports: [ProductCard],
>>>>>>> Stashed changes
})
export class SingleProduct implements OnInit {
  productId!: number;
  productServ = inject(ProductServ);
  cartServ = inject(CartServ);
  favServ = inject(FavServ);
  homeServ = inject(HomeServ);
  activeRoute = inject(ActivatedRoute);
  location = inject(Location);

  ProductById = signal<product | null>(null);
  discount = signal<number>(0);
  perdiscount = signal<number>(0);
  quantityNum = signal<number>(1);
  productsByCategory: product[] = [];
  relatedProducts = signal<product[]>([]);
  isFav!: Signal<boolean>;

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((params) => {
      this.productId = Number(params.get('id'));
      this.productServ.getProductById(this.productId).subscribe((res) => {
        this.productServ.getProductByCategory(res.categoryId).subscribe((res) => {
          this.productsByCategory = res.filter((item) => item.id != this.productId).splice(0, 8);
          this.relatedProducts.set(this.productsByCategory);
        });
      });
      this.productServ.getProductById(this.productId).subscribe((res) => {
        this.ProductById.set(res);
        if (this.ProductById()?.discountPrice) {
          this.discount.set(this.ProductById()!.price - this.ProductById()!.discountPrice!);
          this.perdiscount.set(
            ((this.ProductById()!.price - this.ProductById()!.discountPrice!) * 100) / 100
          );
        }
        this.relatedProducts();
      });
    });

    this.isFav = computed(() =>
      this.favServ.favlist().some((f) => f.id === this.ProductById()?.id)
    );
  }

  goBack() {
    this.location.back();
  }
  decQuantity(quantity: string) {
    if (+quantity <= 0) {
      return;
    } else {
      this.quantityNum.set(Number(+quantity - 1));
    }
  }
  incQuantity(quantity: string) {
    this.quantityNum.set(Number(+quantity + 1));
  }
  addTocart(id: number, quantity: string) {
    this.cartServ.addtocart(id, +quantity);
  }
  addToFav(id: number) {
    this.favServ.addToFav(id);
  }
}
