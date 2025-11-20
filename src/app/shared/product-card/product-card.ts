import { Component, inject, input } from '@angular/core';
import { product } from '../../types';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  productdata = input.required<product>();
  router = inject(Router);
  goToSingleProductPage(id: number) {
    this.router.navigateByUrl(`/singleproduct/${id}`);
  }
}
