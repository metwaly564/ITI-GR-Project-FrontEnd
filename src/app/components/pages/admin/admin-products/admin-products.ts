import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService, CreateProductDTO, UpdateProductDTO } from '../../../../services/admin-serv';
import { HomeServ } from '../../../../services/home-serv';
import { Router } from '@angular/router';

interface Category {
  id: number;
  name: string;
  rank?: number;
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-products.html',
  styleUrls: ['./admin-products.css'],
})
export class AdminProductsComponent implements OnInit {
  adminService = inject(AdminService);
  homeService = inject(HomeServ);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  products: any[] = [];
  categories: Category[] = [];
  filteredProducts: any[] = [];
  
  // Form state
  showForm: boolean = false;
  isEditMode: boolean = false;
  editingProductId: number | null = null;
  
  // Form fields
  productForm: CreateProductDTO = {
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    isPrescriptionRequired: false,
    isActive: true,
    categoryId: 0,
    stock: 0,
  };
  
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  
  // UI state
  isLoading: boolean = false;
  searchTerm: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit() {
    this.checkAuth();
    this.loadCategories();
    this.loadProducts();
    // Ensure filteredProducts is initialized
    this.filteredProducts = [];
  }

  checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login as admin to access this page');
      this.router.navigate(['/login']);
    }
  }

  loadCategories() {
    this.homeService.getHomeData().subscribe({
      next: (res) => {
        this.categories = res.categories || [];
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.errorMessage = 'Failed to load categories';
      },
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Starting to load products...'); // Debug log
    
    // Timeout fallback - ensure loading doesn't stay forever
    const timeoutId = setTimeout(() => {
      if (this.isLoading) {
        console.warn('Products load timeout - forcing stop'); // Debug log
        this.isLoading = false;
        this.errorMessage = 'Request timeout. Please check your connection and try again.';
        this.products = [];
        this.filteredProducts = [];
      }
    }, 30000); // 30 second timeout
    
    this.adminService.getProducts().subscribe({
      next: (res) => {
        clearTimeout(timeoutId);
        console.log('Products response received:', res); // Debug log
        this.isLoading = false;
        
        if (res && res.success !== undefined) {
          if (res.success && res.data) {
            this.products = Array.isArray(res.data) ? res.data : [];
            // Reset search term and filter products to show all
            this.searchTerm = '';
            this.filteredProducts = [...this.products];
            console.log('Products loaded successfully:', this.products.length); // Debug log
            console.log('Filtered products:', this.filteredProducts.length); // Debug log
            // Manually trigger change detection immediately
            this.cdr.detectChanges();
          } else {
            this.products = [];
            this.filteredProducts = [];
            this.errorMessage = res.message || 'Failed to load products';
            console.warn('Products load failed:', res.message); // Debug log
            this.cdr.detectChanges();
          }
        } else {
          // Handle unexpected response structure
          console.error('Unexpected response structure:', res);
          this.isLoading = false;
          this.products = [];
          this.filteredProducts = [];
          this.errorMessage = 'Unexpected response format from server';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        clearTimeout(timeoutId);
        console.error('Error loading products:', err); // Debug log
        this.isLoading = false;
        this.products = [];
        this.filteredProducts = [];
        this.errorMessage = err.error?.message || err.message || 'Failed to load products. Please check if you are logged in as admin.';
        if (err.status === 401 || err.status === 403) {
          alert('Unauthorized. Please login as admin.');
          this.router.navigate(['/login']);
        }
        this.cdr.detectChanges();
      },
      complete: () => {
        clearTimeout(timeoutId);
        console.log('Products subscription completed'); // Debug log
        // Ensure isLoading is false even if something goes wrong
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddForm() {
    this.isEditMode = false;
    this.editingProductId = null;
    this.resetForm();
    this.showForm = true;
  }

  openEditForm(product: any) {
    this.isEditMode = true;
    this.editingProductId = product.id;
    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      isPrescriptionRequired: product.isPrescriptionRequired,
      isActive: product.isActive,
      categoryId: product.categoryId,
      stock: product.quantity || 0,
    };
    this.imagePreview = product.imageUrl || null;
    this.selectedImage = null;
    this.showForm = true;
  }

  resetForm() {
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      discountPrice: 0,
      isPrescriptionRequired: false,
      isActive: true,
      categoryId: 0,
      stock: 0,
    };
    this.selectedImage = null;
    this.imagePreview = null;
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditMode && this.editingProductId) {
      // Update product
      const updateData: UpdateProductDTO = {
        name: this.productForm.name,
        description: this.productForm.description,
        price: this.productForm.price,
        discountPrice: this.productForm.discountPrice,
        isPrescriptionRequired: this.productForm.isPrescriptionRequired,
        isActive: this.productForm.isActive,
        categoryId: this.productForm.categoryId,
        stock: this.productForm.stock,
      };

      this.adminService
        .updateProduct(this.editingProductId, updateData, this.selectedImage || undefined)
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res.success) {
              this.successMessage = 'Product updated successfully!';
              this.loadProducts();
              this.closeForm();
              setTimeout(() => (this.successMessage = ''), 3000);
            } else {
              this.errorMessage = res.message || 'Failed to update product';
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Failed to update product';
            console.error('Update error:', err);
          },
        });
    } else {
      // Create product
      this.adminService
        .createProduct(this.productForm, this.selectedImage || undefined)
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res.success) {
              this.successMessage = 'Product created successfully!';
              this.loadProducts();
              this.closeForm();
              setTimeout(() => (this.successMessage = ''), 3000);
            } else {
              this.errorMessage = res.message || 'Failed to create product';
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Failed to create product';
            console.error('Create error:', err);
          },
        });
    }
  }

  validateForm(): boolean {
    if (!this.productForm.name.trim()) {
      this.errorMessage = 'Product name is required';
      return false;
    }
    if (!this.productForm.description.trim()) {
      this.errorMessage = 'Product description is required';
      return false;
    }
    if (this.productForm.price <= 0) {
      this.errorMessage = 'Price must be greater than 0';
      return false;
    }
    if (this.productForm.categoryId === 0) {
      this.errorMessage = 'Please select a category';
      return false;
    }
    return true;
  }

  deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.isLoading = true;
    this.adminService.deleteProduct(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.successMessage = 'Product deleted successfully!';
          this.loadProducts();
          setTimeout(() => (this.successMessage = ''), 3000);
        } else {
          this.errorMessage = res.message || 'Failed to delete product';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to delete product';
        console.error('Delete error:', err);
      },
    });
  }

  closeForm() {
    this.showForm = false;
    this.resetForm();
    this.errorMessage = '';
  }

  filterProducts() {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = Array.isArray(this.products) ? [...this.products] : [];
      return;
    }

    const search = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = (Array.isArray(this.products) ? this.products : []).filter(
      (p) =>
        p?.name?.toLowerCase().includes(search) ||
        p?.description?.toLowerCase().includes(search) ||
        p?.categoryName?.toLowerCase().includes(search)
    );
  }

  toggleProductStatus(product: any) {
    const updateData: UpdateProductDTO = {
      isActive: !product.isActive,
    };

    this.adminService.updateProduct(product.id, updateData).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadProducts();
        } else {
          this.errorMessage = res.message || 'Failed to update product status';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update product status';
        console.error('Toggle status error:', err);
      },
    });
  }
}
