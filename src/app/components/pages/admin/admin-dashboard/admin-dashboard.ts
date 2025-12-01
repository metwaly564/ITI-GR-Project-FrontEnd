import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Admin Dashboard Component
 * 
 * PROTECTED ROUTE SETUP:
 * The React version used <ProtectedRoute adminOnly={true}>. In Angular, this should be handled
 * via a route guard. Example router configuration:
 * 
 * {
 *   path: 'admin/dashboard',
 *   component: AdminDashboardComponent,
 *   canActivate: [AdminGuard] // or AuthGuard with role check
 * }
 * 
 * Create an AdminGuard that checks:
 * 1. User is authenticated (has valid token)
 * 2. User has 'Admin' role
 * 3. Redirect to login if not authenticated/authorized
 */

interface DashboardItem {
  label: string;
  route: string;
  iconName: string; // Icon name for ng-icons library
  iconColor: string; // Tailwind color class
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent {
  dashboardItems: DashboardItem[] = [
    {
      label: 'Edit Products',
      route: '/AdminEditProducts',
      iconName: 'heroShoppingBag',
      iconColor: 'text-blue-500'
    },
    {
      label: 'Edit Banners',
      route: '/AdminEditBanners',
      iconName: 'heroPhoto',
      iconColor: 'text-purple-500'
    },
    {
      label: 'Edit Tags',
      route: '/AdminEditTags',
      iconName: 'heroTag',
      iconColor: 'text-[rgb(170,15,18)]'
    },
    {
      label: 'Edit Categories',
      route: '/AdminEditCateg',
      iconName: 'heroBuildingStorefront',
      iconColor: 'text-yellow-500'
    },
    {
      label: 'Edit Companies',
      route: '/AdminEditCompanies',
      iconName: 'heroBuildingStorefront',
      iconColor: 'text-green-500'
    },
    {
      label: 'Edit Cities',
      route: '/AdminEditCities',
      iconName: 'heroMapPin',
      iconColor: 'text-red-500'
    },
    {
      label: 'Edit Promo Code',
      route: '/AdminEditPromoCode',
      iconName: 'heroTicket',
      iconColor: 'text-indigo-500'
    },
    {
      label: 'Operation Team',
      route: '/OperationTeamDashboard',
      iconName: 'heroChartBarSquare',
      iconColor: 'text-blue-400'
    },
    {
      label: 'Delivery Boys',
      route: '/AdminEditDeliveryBoys',
      iconName: 'heroTruck',
      iconColor: 'text-orange-500'
    },
    {
      label: 'Edit Staff',
      route: '/AdminEditStaff',
      iconName: 'heroUsers',
      iconColor: 'text-teal-500'
    },
    {
      label: 'Sales Page',
      route: '/AdminSalesDashboard',
      iconName: 'heroCurrencyDollar',
      iconColor: 'text-[rgb(200,15,18)]'
    },
    {
      label: 'Promo Codes Analysis',
      route: '/PromoCodesAnalysis',
      iconName: 'heroChartPie',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Products Analysis',
      route: '/ProductsAnalysis',
      iconName: 'heroCube',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Users Analysis',
      route: '/UsersAnalysis',
      iconName: 'heroUserGroup',
      iconColor: 'text-pink-500'
    },
    {
      label: 'Reports',
      route: '/AdminReports',
      iconName: 'heroDocumentChartBar',
      iconColor: 'text-green-600'
    },
    {
      label: 'Insurance Company',
      route: '/AdminEditInuranceCompany',
      iconName: 'heroShieldCheck',
      iconColor: 'text-cyan-600'
    },
    {
      label: 'Insurance Orders',
      route: '/InsuranceOrders',
      iconName: 'heroClipboardDocumentList',
      iconColor: 'text-emerald-600'
    },
    {
      label: 'PopUp Controller',
      route: '/PopUpController',
      iconName: 'heroMegaphone',
      iconColor: 'text-amber-600'
    }
  ];
}
