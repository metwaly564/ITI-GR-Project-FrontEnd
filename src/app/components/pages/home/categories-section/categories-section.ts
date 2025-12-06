import { Component, inject, OnInit, signal } from '@angular/core';
import { HomeServ } from '../../../../services/home-serv';
import { Category } from '../../../../types/Homets';

@Component({
  selector: 'app-categories-section',
  imports: [],
  templateUrl: './categories-section.html',
  styleUrl: './categories-section.css',
})
export class CategoriesSection implements OnInit {
  ngOnInit(): void {
    this.getCategories();
  }
  homeServ = inject(HomeServ);
  categories = signal<Category[]>([]);
  getCategories() {
    this.homeServ.getHomeData().subscribe((res) => {
      // Filter out categories without imageUrl
      const categoriesWithImages = (res.categories || []).filter(
        (category) => category.imageUrl && category.imageUrl.trim() !== ''
      );
      this.categories.set(categoriesWithImages);
      console.log('Categories with images:', this.categories());
    });
  }
}
