import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'guest-scan',
    loadComponent: () => import('./pages/leaf-scanner/leaf-scanner.component').then(m => m.LeafScannerComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'farmer-dashboard',
        loadComponent: () => import('./pages/farmer-dashboard/farmer-dashboard.component').then(m => m.FarmerDashboardComponent)
      },
      {
        path: 'admin-dashboard',
        loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [roleGuard],
        data: { roles: ['Admin'] }
      },
      {
        path: 'crop-upload',
        loadComponent: () => import('./pages/crop-upload/crop-upload.component').then(m => m.CropUploadComponent)
      },
      {
        path: 'prediction-result',
        loadComponent: () => import('./pages/prediction-result/prediction-result.component').then(m => m.PredictionResultComponent)
      },
      {
        path: 'prediction-history',
        loadComponent: () => import('./pages/prediction-history/prediction-history.component').then(m => m.PredictionHistoryComponent)
      },
      {
        path: 'leaf-scanner',
        loadComponent: () => import('./pages/leaf-scanner/leaf-scanner.component').then(m => m.LeafScannerComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
