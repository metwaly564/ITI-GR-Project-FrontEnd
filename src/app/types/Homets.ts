import { product } from './product';

export interface Homets {
  banners: Banner[];
  categories: Category[];
  featuredProducts: product[];
  popularProducts: product[];
}

export interface Banner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  productCount: number;
}
