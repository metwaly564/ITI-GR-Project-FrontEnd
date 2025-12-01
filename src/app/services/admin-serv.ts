import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { product, ProductDTO } from '../types/product';

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  isPrescriptionRequired: boolean;
  isActive: boolean;
  categoryId: number;
  stock?: number;
  rank?: number;
  maxOrderQuantity?: number;
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
  rank?: number;
  maxOrderQuantity?: number;
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

  // Helper to map ProductDTO to product
  private mapProductDTOToProduct(dto: ProductDTO): product {
    return {
      id: dto.id,
      name: dto.productName || '',
      imageUrl: dto.productImage || '',
      price: dto.price,
      discountPrice: dto.discountPrice,
      description: dto.description,
      isPrescriptionRequired: dto.isPrescriptionRequired,
      isActive: dto.isActive,
      categoryId: dto.categoryId,
      categoryName: dto.categoryName,
      createdAt: dto.createdAt,
      rank: dto.rank,
      maxOrderQuantity: dto.maxOrderQuantity,
      stock: dto.stock || [],
      quantity: dto.stock?.reduce((sum, s) => sum + s.quantity, 0) || 0,
      isFav: false,
    };
  }

  // Get all products
  getProducts(): Observable<ApiResponse<product[]>> {
    return this.http.get<ApiResponse<ProductDTO[]>>(
      `${this.baseUrl}/AdminProducts`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        console.log('Raw API response:', response); // Debug log
        return {
          ...response,
          data: response.data?.map(dto => this.mapProductDTOToProduct(dto)) || []
        };
      }),
      catchError(error => {
        console.error('Error in getProducts:', error);
        return of({
          success: false,
          message: error.error?.message || 'Failed to load products',
          data: [],
          errors: error.error?.errors || [error.message],
          timestamp: new Date().toISOString()
        } as ApiResponse<product[]>);
      })
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
    if (productData.rank !== undefined) {
      formData.append('rank', productData.rank.toString());
    }
    if (productData.maxOrderQuantity !== undefined) {
      formData.append('maxOrderQuantity', productData.maxOrderQuantity.toString());
    }
    
    if (image) {
      formData.append('image', image);
    }

    return this.http.post<ApiResponse<ProductDTO>>(
      `${this.baseUrl}/AdminProducts`,
      formData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => ({
        ...response,
        data: response.data ? this.mapProductDTOToProduct(response.data) : null as any
      }))
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
    if (productData.rank !== undefined) {
      formData.append('rank', productData.rank.toString());
    }
    if (productData.maxOrderQuantity !== undefined) {
      formData.append('maxOrderQuantity', productData.maxOrderQuantity.toString());
    }
    
    if (image) {
      formData.append('image', image);
    }

    return this.http.put<ApiResponse<ProductDTO>>(
      `${this.baseUrl}/AdminProducts/${id}`,
      formData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => ({
        ...response,
        data: response.data ? this.mapProductDTOToProduct(response.data) : null as any
      }))
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
