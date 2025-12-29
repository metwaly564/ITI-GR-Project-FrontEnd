import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';

export interface OrderItemDTO {
  productId: number;
  quantity: number;
}

export interface CreateOrderDTO {
  shippingAddress: string;
  phoneNumber: string;
  cityId: number;
  customerNotes: string;
  prescriptionImageUrl: string;
  paymentMethod: string;
  branchId: number;
  orderItems: OrderItemDTO[];
}

export interface OrderDTO {
  id: number;
  orderNumber: string;
  status: string;
  userId: string;
  totalAmount: number;
  createdAt: string;
  shippingAddress: string;
  phoneNumber: string;
  cityId?: number;
  cityName?: string;
  customerNotes: string;
  prescriptionImageUrl: string;
  paymentStatus: string;
  paymentMethod: string;
  branchName: string;
  userName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://localhost:5062/api/Orders';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    // Check multiple possible token keys
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('userToken') || 
                  localStorage.getItem('Token');
    
    console.log('=== OrderService getAuthHeaders ===');
    console.log('Token from localStorage.getItem("token"):', localStorage.getItem('token') ? 'EXISTS' : 'NOT FOUND');
    console.log('Final token value:', token ? `EXISTS (length: ${token.length})` : 'NOT FOUND');
    
    // Validate token is not empty or invalid
    if (!token || token.trim() === '' || token === 'null' || token === 'undefined') {
      console.warn('❌ No valid authentication token found in OrderService');
      console.log('Available localStorage keys:', Object.keys(localStorage));
      // Don't send empty Bearer token - let the backend handle the 401
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    
    console.log('✅ Token found, adding to Authorization header');
    console.log('Token preview:', token.substring(0, 50) + '...');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log('Authorization header set:', headers.get('Authorization') ? 'YES' : 'NO');
    console.log('=== End OrderService getAuthHeaders ===');
    return headers;
  }

  createOrder(dto: CreateOrderDTO): Observable<OrderDTO> {
    return this.http.post<OrderDTO>(
      this.baseUrl,
      dto,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error creating order:', error);
        throw error;
      })
    );
  }

  getUserOrders(): Observable<OrderDTO[]> {
    return this.http.get<OrderDTO[]>(
      this.baseUrl,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error fetching user orders:', error);
        return of([]);
      })
    );
  }

  getOrderById(id: number): Observable<OrderDTO> {
    return this.http.get<OrderDTO>(
      `${this.baseUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error fetching order:', error);
        throw error;
      })
    );
  }

  cancelOrder(id: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/${id}/cancel`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error cancelling order:', error);
        throw error;
      })
    );
  }
}

