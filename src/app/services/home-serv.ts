import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { Homets } from '../types/home';
import { FavCart } from '../types/cart';

@Injectable({
  providedIn: 'root',
})
export class HomeServ {
  private apidata = 'http://localhost:5062/api/Home';
  http = inject(HttpClient);

  getHomeData() {
    return this.http.get<Homets>(this.apidata).pipe(
      map((res: Homets) => {
        const favproduct = JSON.parse(localStorage.getItem('fav') || '[]');
        return {
          ...res,
          featuredProducts: res.featuredProducts.map((item) => ({
            ...item,
            isFav: !!favproduct.find((fav: FavCart) => fav.id == item.id),
          })),
          popularProducts: res.popularProducts.map((item) => ({
            ...item,
            isFav: !!favproduct.find((fav: FavCart) => fav.id == item.id),
          })),
        };
      }),
      catchError((err) => {
        alert(err.message);
        return [];
      })
    );
  }
}
