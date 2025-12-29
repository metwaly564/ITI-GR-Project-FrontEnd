import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentServ {
  private apidata = 'http://localhost:5062/api/Payments';
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

  createPaymentIntent(amount: number): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(
      `${this.apidata}/create-payment-intent`,
      { amount },
      this.getAuthHeaders()
    );
  }
}
