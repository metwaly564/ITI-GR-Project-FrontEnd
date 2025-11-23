import { Injectable, signal } from '@angular/core';
import { FavCart } from '../types/cart';

@Injectable({
  providedIn: 'root',
})
export class FavServ {
  favCount = signal(0);
  constructor() {
    this.favCount.set(this.getallfav());
  }
  getallfav(): number {
    let favproduct = localStorage.getItem('fav');
    const favproductArray: FavCart[] = favproduct ? JSON.parse(favproduct) : [];
    let totalQuantity = favproductArray.length;
    return totalQuantity;
  }

  addToFav(id: number) {
    let favproduct = localStorage.getItem('fav');
    const favproductArray: FavCart[] = favproduct ? JSON.parse(favproduct) : [];
    console.log(favproductArray.find((f) => f.id == id));

    let excitingindex = favproductArray.findIndex((item: FavCart) => item.id == id);
    if (excitingindex > -1) {
      let updatefav = favproductArray.filter((item) => item.id != id);
      localStorage.setItem('fav', JSON.stringify(updatefav));
    } else {
      favproductArray.push({
        id: id,
      });
      localStorage.setItem('fav', JSON.stringify(favproductArray));
    }
    this.favCount.set(this.getallfav());
  }
}
