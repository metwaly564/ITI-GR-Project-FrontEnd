import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService, CreateBannerDTO, UpdateBannerDTO, Banner } from '../../../../services/admin-serv';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-banners',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-banners.html',
  styleUrls: ['./admin-banners.css'],
})
export class AdminBannersComponent implements OnInit {
  adminService = inject(AdminService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  banners: Banner[] = [];
  filteredBanners: Banner[] = [];

  // Form state
  showForm: boolean = false;
  isEditMode: boolean = false;
  editingBannerId: number | null = null;

  // Form fields
  bannerForm: CreateBannerDTO = {
    title: '',
    description: '',
    link: '',
    displayOrder: 0,
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
    this.loadBanners();
    this.filteredBanners = [];
  }

  checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login as admin to access this page');
      this.router.navigate(['/login']);
    }
  }

  loadBanners() {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Starting to load banners...');

    const timeoutId = setTimeout(() => {
      if (this.isLoading) {
        console.warn('Banners load timeout - forcing stop');
        this.isLoading = false;
        this.errorMessage = 'Request timeout. Please check your connection and try again.';
        this.banners = [];
        this.filteredBanners = [];
        this.cdr.detectChanges();
      }
    }, 30000);

    this.adminService.getBanners().subscribe({
      next: (res) => {
        clearTimeout(timeoutId);
        console.log('Banners response received:', res);
        this.isLoading = false;

        if (res && res.success !== undefined) {
          if (res.success && res.data) {
            this.banners = Array.isArray(res.data) ? res.data : [];
            this.searchTerm = '';
            this.filteredBanners = [...this.banners];
            console.log('Banners loaded successfully:', this.banners.length);
            this.cdr.detectChanges();
          } else {
            this.banners = [];
            this.filteredBanners = [];
            this.errorMessage = res.message || 'Failed to load banners';
            console.warn('Banners load failed:', res.message);
            this.cdr.detectChanges();
          }
        } else {
          console.error('Unexpected response structure:', res);
          this.isLoading = false;
          this.banners = [];
          this.filteredBanners = [];
          this.errorMessage = 'Unexpected response format from server';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        clearTimeout(timeoutId);
        console.error('Error loading banners:', err);
        this.isLoading = false;
        this.banners = [];
        this.filteredBanners = [];
        this.errorMessage = err.error?.message || err.message || 'Failed to load banners. Please check if you are logged in as admin.';
        if (err.status === 401 || err.status === 403) {
          alert('Unauthorized. Please login as admin.');
          this.router.navigate(['/login']);
        }
        this.cdr.detectChanges();
      },
      complete: () => {
        clearTimeout(timeoutId);
        console.log('Banners subscription completed');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddForm() {
    this.isEditMode = false;
    this.editingBannerId = null;
    this.resetForm();
    this.showForm = true;
  }

  openEditForm(banner: Banner) {
    this.isEditMode = true;
    this.editingBannerId = banner.id;
    this.bannerForm = {
      title: banner.title,
      description: banner.description,
      link: banner.link,
      displayOrder: banner.displayOrder,
    };
    this.imagePreview = banner.imageUrl || null;
    this.selectedImage = null;
    this.showForm = true;
  }

  resetForm() {
    this.bannerForm = {
      title: '',
      description: '',
      link: '',
      displayOrder: 0,
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

    if (this.isEditMode && this.editingBannerId) {
      // Update banner
      const updateData: UpdateBannerDTO = {
        title: this.bannerForm.title,
        description: this.bannerForm.description,
        link: this.bannerForm.link,
        displayOrder: this.bannerForm.displayOrder,
      };

      this.adminService
        .updateBanner(this.editingBannerId, updateData, this.selectedImage || undefined)
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res.success) {
              this.successMessage = 'Banner updated successfully!';
              this.loadBanners();
              this.closeForm();
              setTimeout(() => (this.successMessage = ''), 3000);
            } else {
              this.errorMessage = res.message || 'Failed to update banner';
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Failed to update banner';
            console.error('Update error:', err);
          },
        });
    } else {
      // Create banner
      this.adminService
        .createBanner(this.bannerForm, this.selectedImage || undefined)
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res.success) {
              this.successMessage = 'Banner created successfully!';
              this.loadBanners();
              this.closeForm();
              setTimeout(() => (this.successMessage = ''), 3000);
            } else {
              this.errorMessage = res.message || 'Failed to create banner';
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Failed to create banner';
            console.error('Create error:', err);
          },
        });
    }
  }

  validateForm(): boolean {
    if (!this.bannerForm.title.trim()) {
      this.errorMessage = 'Banner title is required';
      return false;
    }
    if (!this.bannerForm.description.trim()) {
      this.errorMessage = 'Banner description is required';
      return false;
    }
    if (!this.selectedImage && !this.isEditMode) {
      this.errorMessage = 'Banner image is required';
      return false;
    }
    return true;
  }

  deleteBanner(id: number) {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    this.isLoading = true;
    this.adminService.deleteBanner(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.successMessage = 'Banner deleted successfully!';
          this.loadBanners();
          setTimeout(() => (this.successMessage = ''), 3000);
        } else {
          this.errorMessage = res.message || 'Failed to delete banner';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to delete banner';
        console.error('Delete error:', err);
      },
    });
  }

  closeForm() {
    this.showForm = false;
    this.resetForm();
    this.errorMessage = '';
  }

  filterBanners() {
    if (!this.searchTerm.trim()) {
      this.filteredBanners = Array.isArray(this.banners) ? [...this.banners] : [];
      return;
    }

    const search = this.searchTerm.toLowerCase().trim();
    this.filteredBanners = (Array.isArray(this.banners) ? this.banners : []).filter(
      (b) =>
        b?.title?.toLowerCase().includes(search) ||
        b?.description?.toLowerCase().includes(search) ||
        b?.link?.toLowerCase().includes(search)
    );
  }

  toggleBannerStatus(banner: Banner) {
    const updateData: UpdateBannerDTO = {
      isActive: !banner.isActive,
    };

    this.adminService.updateBanner(banner.id, updateData).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadBanners();
        } else {
          this.errorMessage = res.message || 'Failed to update banner status';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update banner status';
        console.error('Toggle status error:', err);
      },
    });
  }
}
