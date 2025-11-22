export interface product {
  quantity: number;
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  isPrescriptionRequired: boolean;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  stock: Stock[] | [];
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
