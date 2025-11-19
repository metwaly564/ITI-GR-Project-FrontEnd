import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { products } from '../types';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductServ {
  private apidata = 'https://dummyjson.com/products';
  http = inject(HttpClient);

  getProduct() {
    return this.http.get<products>(this.apidata).pipe(
      map((res) => res.products),
      catchError((err: any) => {
        alert(err.message);
        return [];
      })
    );
  }
}
