import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { product } from '../types/product';

@Injectable({
  providedIn: 'root',
})
export class ProductServ {
  private apidata = 'http://localhost:5062/api/Products';
  http = inject(HttpClient);

  getProduct() {
    return this.http.get<product[]>(this.apidata).pipe(
      map((res) => res),
      catchError((err: any) => {
        alert(err.message);
        return [];
      })
    );
  }
  getProductById(id: number) {
    return this.http.get<product>(`${this.apidata}/${id}`).pipe(
      map((res) => res),
      catchError((err: any) => {
        alert(err.message);
        return [];
      })
    );
  }
}
