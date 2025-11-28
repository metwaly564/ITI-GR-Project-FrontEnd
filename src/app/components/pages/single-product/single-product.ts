import { Component, computed, effect, inject, OnInit, Signal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductServ } from '../../../services/product-serv';
import { product } from '../../../types/product';
import { Location } from '@angular/common';
import { CartServ } from '../../../services/cart-serv';
import { FavServ } from '../../../services/fav-serv';
import { Category, Homets } from '../../../types/Homets';
import { HomeServ } from '../../../services/home-serv';
import { ProductCard } from '../../../shared/product-card/product-card';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.html',
  styleUrls: ['./single-product.css'],
  imports: [ ProductCard],
})
export class SingleProduct implements OnInit {
  constructor() {
    effect(() => {
      if (this.categories().length > 0 && this.allProducts().length > 0 && this.ProductById()) {
        this.getRelatedProducts();
      }
    });
  }
  productServ = inject(ProductServ);
  cartServ = inject(CartServ);
  favServ = inject(FavServ);
  homeServ = inject(HomeServ);
  activeRoute = inject(ActivatedRoute);
  location = inject(Location);
  ProductById = signal<product | null>(null);
  id = signal<number>(0);
  discount = signal<number>(0);
  perdiscount = signal<number>(0);
  quantityNum = signal<number>(1);
  categories = signal<Category[]>([]);
  allProducts = signal<product[]>([]);
  relatedProducts = signal<product[]>([]);
  isFav!: Signal<boolean>;

  homeData = this.homeServ.getHomeData().subscribe((res: Homets) => {
    this.categories.set(res.categories);
  });

  ngOnInit(): void {
    this.getRelatedProducts();
    this.productServ.getProduct().subscribe((res) => this.allProducts.set(res));

    this.id.set(Number(this.activeRoute.snapshot.params['id']));
    this.productServ.getProductById(this.id()).subscribe((res) => {
      this.ProductById.set(res);
      if (this.ProductById()?.discountPrice) {
        this.discount.set(this.ProductById()!.price - this.ProductById()!.discountPrice!);
        this.perdiscount.set(
          ((this.ProductById()!.price - this.ProductById()!.discountPrice!) * 100) / 100
        );
      }
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

  getRelatedProducts() {
    const currentCategory = this.categories().find(
      (item) => item.name === this.ProductById()?.categoryName
    );
    const allProductsRelated = this.allProducts().filter(
      (item) => item.categoryName === currentCategory!.name
    );
    this.relatedProducts.set(allProductsRelated);
  }
}
