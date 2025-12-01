import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { product } from '../types/product';

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  isPrescriptionRequired: boolean;
  isActive: boolean;
  categoryId: number;
  stock?: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  isPrescriptionRequired?: boolean;
  isActive?: boolean;
  categoryId?: number;
  stock?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = 'http://localhost:5062/api/admin';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  // Get all products
  getProducts(): Observable<ApiResponse<product[]>> {
    return this.http.get<ApiResponse<product[]>>(
      `${this.baseUrl}/AdminProducts`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get product by ID
  getProductById(id: number): Observable<ApiResponse<product>> {
    return this.http.get<ApiResponse<product>>(
      `${this.baseUrl}/AdminProducts/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Create product with image
  createProduct(productData: CreateProductDTO, image?: File): Observable<ApiResponse<product>> {
    const formData = new FormData();
    
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    if (productData.discountPrice !== undefined) {
      formData.append('discountPrice', productData.discountPrice.toString());
    }
    formData.append('isPrescriptionRequired', productData.isPrescriptionRequired.toString());
    formData.append('isActive', productData.isActive.toString());
    formData.append('categoryId', productData.categoryId.toString());
    if (productData.stock !== undefined) {
      formData.append('stock', productData.stock.toString());
    }
    
    if (image) {
      formData.append('image', image);
    }

    return this.http.post<ApiResponse<product>>(
      `${this.baseUrl}/AdminProducts`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update product with image
  updateProduct(id: number, productData: UpdateProductDTO, image?: File): Observable<ApiResponse<product>> {
    const formData = new FormData();
    
    if (productData.name) formData.append('name', productData.name);
    if (productData.description) formData.append('description', productData.description);
    if (productData.price !== undefined) formData.append('price', productData.price.toString());
    if (productData.discountPrice !== undefined) {
      formData.append('discountPrice', productData.discountPrice.toString());
    }
    if (productData.isPrescriptionRequired !== undefined) {
      formData.append('isPrescriptionRequired', productData.isPrescriptionRequired.toString());
    }
    if (productData.isActive !== undefined) {
      formData.append('isActive', productData.isActive.toString());
    }
    if (productData.categoryId !== undefined) {
      formData.append('categoryId', productData.categoryId.toString());
    }
    if (productData.stock !== undefined) {
      formData.append('stock', productData.stock.toString());
    }
    
    if (image) {
      formData.append('image', image);
    }

    return this.http.put<ApiResponse<product>>(
      `${this.baseUrl}/AdminProducts/${id}`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete product
  deleteProduct(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(
      `${this.baseUrl}/AdminProducts/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get paginated products
  getProductsPaginated(page: number = 1, pageSize: number = 10, search?: string): Observable<ApiResponse<any>> {
    let url = `${this.baseUrl}/AdminProducts/paginated?page=${page}&pageSize=${pageSize}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get<ApiResponse<any>>(url, { headers: this.getAuthHeaders() });
  }

  // Toggle featured status
  toggleFeaturedStatus(id: number): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(
      `${this.baseUrl}/AdminProducts/${id}/toggle-featured`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Get product stats
  getProductStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/AdminProducts/stats`,
      { headers: this.getAuthHeaders() }
    );
  }
}
