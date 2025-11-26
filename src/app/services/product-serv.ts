import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { product } from '../types/product';
import { FavCart } from '../types/cart';

@Injectable({
  providedIn: 'root',
})
export class ProductServ {
  private apidata = 'http://localhost:5062/api/Products';
  http = inject(HttpClient);

  getProduct() {
    return this.http.get<product[]>(this.apidata).pipe(
      map((res) => {
        let favproduct = localStorage.getItem('fav');
        const favproductArray: FavCart[] = favproduct ? JSON.parse(favproduct) : [];
        return res.map((p) => ({
          ...p,
          isFav: !!favproductArray.find((f) => f.id == p.id),
        }));
      }),
      catchError((err: any) => {
        alert(err.message);
        return [];
      })
    );
  }
  getProductById(id: number) {
    return this.http.get<product>(`${this.apidata}/${id}`).pipe(
      map((res) => {
        let favproduct = localStorage.getItem('fav');
        const favproductArray: FavCart[] = favproduct ? JSON.parse(favproduct) : [];
        return {
          ...res,
          isFav: !!favproductArray.find((f) => f.id == id),
        };
      }),
      catchError((err: any) => {
        alert(err.message);
        return [];
      })
    );
  }
  getProductByCategory(id: number) {
    return this.http.get<product[]>(`${this.apidata}/category/${id}`).pipe(
      map((res) => {
        console.log(res);
        return res;
      }),
      catchError((err: any) => {
        alert(err.message);
        return [];
      })
    );
  }
}
