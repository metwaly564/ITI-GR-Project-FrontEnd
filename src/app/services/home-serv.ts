import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { product } from '../types/product';
import { catchError, map } from 'rxjs';
import { Home } from '../components/home/home';

@Injectable({
  providedIn: 'root',
})
export class HomeServ {
  private apidata = 'http://localhost:5062/api/Home';
  http = inject(HttpClient);

  getFeatureProduct() {
    return this.http.get<Home>(this.apidata).pipe(
      map((res) => {
        return res.featuredProducts;
      }),
      catchError((err) => {
        alert(err.message);
        return [];
      })
    );
  }
  getPopularProduct() {
    return this.http.get<Home>(this.apidata).pipe(
      map((res) => {
        console.log(res);
        console.log(res.popularProducts);

        return res.popularProducts;
      }),
      catchError((err) => {
        alert(err.message);
        return [];
      })
    );
  }
}
