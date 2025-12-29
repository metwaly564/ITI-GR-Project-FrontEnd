import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

export interface Review {
  id: number;
  userId: string;
  userName: string;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
}

export interface CreateReviewDTO {
  productId: number;
  rating: number;
  comment: string;
}

export interface ReviewStatus {
  canReview: boolean;
  message: string;
  isVerifiedPurchase: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewServ {
  private apidata = 'http://localhost:5062/api/Reviews';
  http = inject(HttpClient);

  private getAuthHeaders() {
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('userToken') || 
                  localStorage.getItem('Token');
    
    let cleanToken = token;
    if (cleanToken && cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
      cleanToken = cleanToken.slice(1, -1);
    }

    return {
      headers: {
        'Authorization': `Bearer ${cleanToken || ''}`
      }
    };
  }

  getProductReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apidata}/product/${productId}`).pipe(
      catchError((err) => {
        console.error('CRITICAL: Product review error body:', err.error);
        return of([]);
      })
    );
  }

  getReviewStatus(productId: number): Observable<ReviewStatus> {
    return this.http.get<ReviewStatus>(`${this.apidata}/status/${productId}`, this.getAuthHeaders()).pipe(
      catchError((err) => {
        console.error('CRITICAL: Review status error body:', err.error);
        return of({ canReview: false, message: 'Could not verify purchase status.', isVerifiedPurchase: false });
      })
    );
  }

  addReview(dto: CreateReviewDTO): Observable<Review | null> {
    return this.http.post<Review>(this.apidata, dto, this.getAuthHeaders()).pipe(
      catchError((err) => {
        console.error('Error adding review:', err);
        alert(err.error?.message || 'Failed to add review');
        return of(null);
      })
    );
  }
}
