import { Component, signal, OnInit, AfterViewInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { CartServ } from '../../../services/cart-serv';
import { OrderService, CreateOrderDTO } from '../../../services/order-serv';
import { ProductServ } from '../../../services/product-serv';
import { CityService, CityDTO } from '../../../services/city-serv';
import { BranchServ } from '../../../services/branch-serv';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentServ } from '../../../services/payment-serv';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent implements OnInit {
  private stripe: any;
  private cartServ = inject(CartServ);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private productServ = inject(ProductServ);
  private cityService = inject(CityService);
  private branchService = inject(BranchServ);
  private paymentServ = inject(PaymentServ);

  orderNumber = signal<string>('');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  showForm = signal<boolean>(true);
  cities = signal<CityDTO[]>([]);

  // Form fields (using regular properties for ngModel two-way binding)
  phoneNumber: string = '';
  shippingAddress: string = '';
  cityId: number = 0;
  customerNotes: string = '';
  paymentMethod: string = 'Cash'; // Default to COD
  stripePromise: any;
  card: any;
  elements: any;
  isStripeLoading: boolean = false;

  // Helper method to decode JWT and check expiration
  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return true; // Invalid JWT format
      }
      
      // Decode the payload (second part)
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if token has expiration claim
      if (payload.exp) {
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const isExpired = currentTime >= expirationTime;
        
        if (isExpired) {
          console.log('Token is expired');
          console.log('Expiration time:', new Date(expirationTime).toISOString());
          console.log('Current time:', new Date(currentTime).toISOString());
        } else {
          console.log('Token is valid');
          console.log('Expires at:', new Date(expirationTime).toISOString());
        }
        
        return isExpired;
      }
      
      // If no expiration claim, assume token is valid (though this is unusual)
      return false;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // If we can't decode it, consider it invalid
    }
  }

  // Helper method to ensure proper type checking
  private validateForm(): boolean {
    const phone = this.phoneNumber?.trim() || '';
    const address = this.shippingAddress?.trim() || '';
    
    if (!phone) {
      this.errorMessage.set('Phone number is required');
      return false;
    }
    if (phone.length < 8) {
      this.errorMessage.set('Phone number must be at least 8 characters long');
      return false;
    }
    if (!address) {
      this.errorMessage.set('Detailed shipping address is required');
      return false;
    }
    if (address.length < 10) {
      this.errorMessage.set('Shipping address must be at least 10 characters long. Please provide more details.');
      return false;
    }
    if (!this.cityId || this.cityId === 0) {
      this.errorMessage.set('Please select a city');
      return false;
    }
    return true;
  }

  ngOnInit(): void {
    // Check authentication first to clear any login-related errors
    this.checkAuthentication();
    // Then load cities and branches
    this.loadCities();
    this.loadBranches();
  }

  onPaymentMethodChange(): void {
    if (this.paymentMethod === 'Online' && !this.card) {
      this.initStripe();
    }
  }

  async initStripe() {
    this.isStripeLoading = true;
    try {
      this.stripe = await loadStripe('pk_test_51P...'); // Use placeholder publishable key
      if (this.stripe) {
        this.elements = this.stripe.elements();
        this.card = this.elements.create('card', {
          style: {
            base: {
              color: '#32325d',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4'
              }
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
            }
          }
        });
        
        // Wait for DOM to update after paymentMethod change
        setTimeout(() => {
          this.card.mount('#card-element');
        }, 100);
      }
    } catch (e) {
      console.warn('Stripe initialization failed (bypassing):', e);
      // No longer setting errorMessage to allow "faking success" flow
    } finally {
      this.isStripeLoading = false;
    }
  }
  
  loadBranches(): void {
    this.branchService.getBranches().subscribe({
      next: (branches) => {
        if (branches && branches.length > 0) {
          // Store the first available branch ID in localStorage if not already set
          const currentBranchId = localStorage.getItem('branchId');
          if (!currentBranchId || !branches.some(b => b.id === parseInt(currentBranchId, 10))) {
            localStorage.setItem('branchId', branches[0].id.toString());
            console.log('Set default branch ID to:', branches[0].id);
          }
        } else {
          console.warn('No branches available');
        }
      },
      error: (err) => {
        console.error('Error loading branches:', err);
        // Don't set error message for branch loading failure, just use default
      }
    });
  }

  checkAuthentication(): void {
    // Check if user is authenticated - check multiple possible token keys
    const tokenKey = 'token';
    const userTokenKey = 'userToken';
    const TokenKey = 'Token';
    
    const token1 = localStorage.getItem(tokenKey);
    const token2 = localStorage.getItem(userTokenKey);
    const token3 = localStorage.getItem(TokenKey);
    
    const token = token1 || token2 || token3;
    
    console.log('=== Authentication Check ===');
    console.log(`localStorage.getItem("${tokenKey}"):`, token1 ? `EXISTS (length: ${token1.length})` : 'NOT FOUND');
    console.log(`localStorage.getItem("${userTokenKey}"):`, token2 ? `EXISTS (length: ${token2.length})` : 'NOT FOUND');
    console.log(`localStorage.getItem("${TokenKey}"):`, token3 ? `EXISTS (length: ${token3.length})` : 'NOT FOUND');
    console.log('Final token value:', token ? `EXISTS (length: ${token.length})` : 'NOT FOUND');
    console.log('All localStorage keys:', Object.keys(localStorage));
    
    // Check each key individually for debugging
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.toLowerCase().includes('token')) {
        console.log(`Found token-related key: "${key}" = "${localStorage.getItem(key)?.substring(0, 50)}..."`);
      }
    }
    
    // Validate token is not empty or invalid
    const isValidToken = token && 
                         token.trim() !== '' && 
                         token !== 'null' && 
                         token !== 'undefined' &&
                         token.length > 10; // JWT tokens are typically much longer
    
    if (!isValidToken) {
      console.log('❌ No valid token found - setting error message');
      this.errorMessage.set('Please log in to complete your order.');
    } else {
      // Check if token is expired
      if (this.isTokenExpired(token)) {
        console.log('❌ Token is expired - setting error message');
        this.errorMessage.set('Your session has expired. Please log in again to complete your order.');
        // Optionally clear the expired token
        localStorage.removeItem('token');
        localStorage.removeItem('userToken');
        localStorage.removeItem('Token');
      } else {
        console.log('✅ Token found and valid, user is authenticated - clearing error message');
        console.log('Token starts with:', token.substring(0, 20));
        this.errorMessage.set(''); // Clear any previous error messages
      }
    }
    console.log('=== End Authentication Check ===');
  }

  loadCities(): void {
    this.cityService.getCities().subscribe({
      next: (cities) => {
        this.cities.set(cities.filter(c => c.isActive));
        // Only clear error message if it was about cities, not about authentication
        if (this.errorMessage().includes('Failed to load cities')) {
          this.errorMessage.set('');
        }
      },
      error: (err) => {
        console.error('Error loading cities:', err);
        // Only set error if it's not an authentication error
        if (!this.errorMessage().includes('log in') && !this.errorMessage().includes('session')) {
          this.errorMessage.set('Failed to load cities. Please refresh the page.');
        }
      }
    });
  }

  createOrder(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Check if user is authenticated - check multiple possible token keys
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('userToken') || 
                  localStorage.getItem('Token');
    
    // Also check if token exists but is empty or invalid
    if (!token || token.trim() === '' || token === 'null' || token === 'undefined') {
      console.log('❌ No valid token found in localStorage during createOrder');
      console.log('Available localStorage keys:', Object.keys(localStorage));
      this.isLoading.set(false);
      this.errorMessage.set('Please log in to complete your order.');
      return;
    }
    
    // Check if token is expired before making the API call
    if (this.isTokenExpired(token)) {
      console.log('❌ Token is expired - cannot create order');
      this.isLoading.set(false);
      this.errorMessage.set('Your session has expired. Please log in again to complete your order.');
      // Clear expired token
      localStorage.removeItem('token');
      localStorage.removeItem('userToken');
      localStorage.removeItem('Token');
      return;
    }
    
    console.log('✅ Token found and valid, proceeding with order creation');
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 50) + '...');

    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cartItems.length === 0) {
      this.errorMessage.set('Your cart is empty');
      this.isLoading.set(false);
      return;
    }

    // Get cart total
    this.productServ.getProduct().subscribe({
      next: (products) => {
        const fullCart = cartItems.map((c: any) => {
          const product = products.find((p) => p.id === c.id);
          return product ? { ...product, quantity: c.quantity } : null;
        }).filter((x: any) => x);

        if (fullCart.length === 0) {
          this.isLoading.set(false);
          this.errorMessage.set('No valid products in cart');
          return;
        }

        const subtotal = fullCart.reduce(
          (sum: number, item: any) => sum + (item.price || 0) * item.quantity,
          0
        );
        const shipping = fullCart.length > 0 ? 5 : 0;
        const total = subtotal + shipping;

        // Create order items from cart
        const orderItems = fullCart.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity
        }));

        // Validate form fields
        if (!this.validateForm()) {
          this.isLoading.set(false);
          this.showForm.set(true);
          return;
        }

        // Create order DTO with form values
        // Ensure cityId is a number (ngModel with select returns string)
        const cityIdNumber = typeof this.cityId === 'string' ? parseInt(this.cityId, 10) : Number(this.cityId);
        
        if (isNaN(cityIdNumber) || cityIdNumber <= 0) {
          this.isLoading.set(false);
          this.errorMessage.set('Please select a valid city.');
          this.showForm.set(true);
          return;
        }
        
        const orderDTO: CreateOrderDTO = {
          shippingAddress: this.shippingAddress.trim(),
          phoneNumber: this.phoneNumber.trim(),
          cityId: cityIdNumber,
          customerNotes: (this.customerNotes || '').trim(),
          prescriptionImageUrl: (localStorage.getItem('prescriptionImageUrl') || '').trim(),
          paymentMethod: this.paymentMethod,
          branchId: parseInt(localStorage.getItem('branchId') || '1', 10), // Use branch from localStorage or default to 1
          orderItems: orderItems
        };

        // If Payment Method is Online, handle Stripe first
        if (this.paymentMethod === 'Online') {
          this.isLoading.set(true);
          this.paymentServ.createPaymentIntent(total).subscribe({
            next: async (res: { clientSecret: string }) => {
              const { clientSecret } = res;
              
              if (!this.stripe) {
                console.warn('Stripe not initialized, faking success');
                this.finishOrder(orderDTO);
                return;
              }

              const result = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                  card: this.card,
                  billing_details: {
                    phone: this.phoneNumber,
                    address: {
                      line1: this.shippingAddress
                    }
                  }
                }
              });

              if (result.error) {
                // Fake success for testing/demo as requested
                console.warn('Payment failed but faking success:', result.error.message);
                this.finishOrder(orderDTO);
              } else if (result.paymentIntent.status === 'succeeded') {
                // Payment successful, now create the order
                this.finishOrder(orderDTO);
              }
            },
            error: (err: any) => {
              // Fake success for testing/demo as requested
              console.warn('Payment intent failed but faking success:', err);
              this.finishOrder(orderDTO);
            }
          });
        } else {
          // COD - Directly finish order
          this.finishOrder(orderDTO);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load cart items. Please try again.');
        console.error('Error loading products:', err);
      }
    });
  }

  finishOrder(orderDTO: CreateOrderDTO): void {
    this.isLoading.set(true);
    this.showForm.set(false);

    this.orderService.createOrder(orderDTO).subscribe({
      next: (order) => {
        console.log('Order created successfully:', order);
        this.isLoading.set(false);
        this.orderNumber.set(order.orderNumber);
        this.clearCart();
        
        // Redirect to home after showing success message for 3 seconds
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showForm.set(true);
        let errorMsg = 'Failed to create order. Please try again.';
        if (err.error?.message) errorMsg = err.error.message;
        this.errorMessage.set(errorMsg);
      }
    });
  }

  clearCart(): void {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    cartItems.forEach((item: any) => {
      this.cartServ.addtocart(item.id, 0);
    });
  }

  backToHome(): void {
    this.router.navigate(['/home']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  isAuthError(): boolean {
    const error = this.errorMessage();
    return error.includes('log in') || error.includes('session') || error.includes('expired');
  }
}
