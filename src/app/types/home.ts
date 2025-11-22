export interface Homets {
  banners: Banner[];
  categories: Category[];
  featuredProducts: FeaturedProduct[];
  popularProducts: PopularProduct[];
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

export interface FeaturedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  isPrescriptionRequired: boolean;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  stock: Stock[];
}

export interface Stock {
  productId: number;
  productName: string;
  branchId: number;
  branchName: string;
  quantity: number;
  minimumStockLevel: number;
  maximumStockLevel: number;
  lastRestocked: string;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

export interface PopularProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  isPrescriptionRequired: boolean;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  stock: Stock2[];
}

export interface Stock2 {
  productId: number;
  productName: string;
  branchId: number;
  branchName: string;
  quantity: number;
  minimumStockLevel: number;
  maximumStockLevel: number;
  lastRestocked: string;
  isLowStock: boolean;
  isOutOfStock: boolean;
}
