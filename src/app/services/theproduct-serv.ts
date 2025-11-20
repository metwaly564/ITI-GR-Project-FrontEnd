import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs';
import { products } from '../thetypes';

@Injectable({
  providedIn: 'root',
})
export class TheproductServ {
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
