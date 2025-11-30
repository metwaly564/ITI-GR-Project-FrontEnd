import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { Homets } from '../types/Homets';

interface HomeDataResponse {
  categories: any[];
  banners: any[];
  featuredProducts: any[];
  popularProducts: any[];
  products: any[];
}

@Injectable({
  providedIn: 'root',
})
export class HomeServ {
  private apidata = 'http://localhost:5062/api/Home';
  http = inject(HttpClient);

  getHomeData() {
    return this.http.get<HomeDataResponse>(this.apidata).pipe(
      map((res: HomeDataResponse) => {
        const favproduct = JSON.parse(localStorage.getItem('fav') || '[]');
        // Map the response to match Homets interface
        return {
          categories: res.categories || [],
          banners: res.banners || [],
          featuredProducts: res.featuredProducts || [],
          popularProducts: res.popularProducts || []
        } as Homets;
      }),
      catchError((err) => {
        console.error('Error fetching home data:', err);
        // Return empty structure on error
        return of({
          categories: [],
          banners: [],
          featuredProducts: [],
          popularProducts: []
        } as Homets);
      })
    );
  }
}
