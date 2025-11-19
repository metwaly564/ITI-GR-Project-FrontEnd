import { Component, inject, input } from '@angular/core';
import { product } from '../../types';
import { ProductServ } from '../../services/product-serv';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  productdata = input.required<product>();
}
