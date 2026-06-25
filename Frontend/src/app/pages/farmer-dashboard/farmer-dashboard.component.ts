import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule, TranslateModule],
  template: `
    <div class="dashboard-container">
      <div class="ambient-blob blob-1"></div>
      <div class="ambient-blob blob-2"></div>

      <div class="dashboard-content">
        <header class="glass-header animate-fade-in">
          <div class="profile-section">
            <div class="avatar-wrapper">
              <img src="https://ui-avatars.com/api/?name={{userName}}&background=10b981&color=fff&rounded=true&bold=true" alt="User Avatar" class="avatar-image"/>
              <span class="online-badge"></span>
            </div>
            <div class="profile-info">
              <h2 class="username">
                {{ userName }} 
                <mat-icon class="verified-icon" title="Verified Account">verified</mat-icon>
              </h2>
              <p class="role">Smart Crop Management System</p>
            </div>
          </div>
          <div class="header-actions">
             <button mat-flat-button class="settings-btn" routerLink="/profile">
               <mat-icon>settings</mat-icon> {{ 'DASHBOARD.SETTINGS' | translate }}
             </button>
          </div>
        </header>

        <div class="section-heading animate-fade-in">
          <div class="heading-icon-box">
            <mat-icon>insights</mat-icon>
          </div>
          <h2>{{ 'DASHBOARD.FARMER_TITLE' | translate }} Analytics</h2>
        </div>

        <div class="stats-grid animate-slide-up">
          <div class="stat-card glass-panel primary">
            <div class="icon-blob"><mat-icon>qr_code_scanner</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">{{ totalScans }}</span>
              <span class="stat-label">{{ 'DASHBOARD.TOTAL_PREDICTIONS' | translate }}</span>
            </div>
          </div>
          <div class="stat-card glass-panel danger">
            <div class="icon-blob"><mat-icon>warning_amber</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">{{ diseaseAlerts }}</span>
              <span class="stat-label">{{ 'DASHBOARD.RECENT_DISEASES' | translate }}</span>
            </div>
          </div>
          <div class="stat-card glass-panel success">
            <div class="icon-blob"><mat-icon>eco</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">{{ healthyPlants }}</span>
              <span class="stat-label">{{ 'DASHBOARD.HEALTHY_PLANTS' | translate }}</span>
            </div>
          </div>
        </div>

        <div class="actions-grid animate-slide-up-delayed">
          <div class="action-card glass-panel core-feature" routerLink="/crop-upload">
            <div class="card-glow"></div>
            <div class="action-blob primary-blob">
              <mat-icon>add_a_photo</mat-icon>
            </div>
            <div class="action-text">
              <h3>{{ 'UPLOAD.TITLE' | translate }}</h3>
              <p>{{ 'UPLOAD.SUBTITLE' | translate }}</p>
            </div>
            <button mat-flat-button class="scan-now-btn">
              <mat-icon>center_focus_strong</mat-icon> {{ 'UPLOAD.ANALYZE' | translate }}
            </button>
          </div>

          <div class="action-card glass-panel secondary-feature" routerLink="/prediction-history">
            <div class="action-blob secondary-blob">
              <mat-icon>history</mat-icon>
            </div>
            <div class="action-text">
              <h3>{{ 'HISTORY.TITLE' | translate }}</h3>
              <p>{{ 'HISTORY.HISTORY_SUBTITLE' | translate }}</p>
            </div>
            <button mat-stroked-button class="history-btn">
              <mat-icon>manage_search</mat-icon> {{ 'HISTORY.VIEW_HISTORY' | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { 
      --brand-dark: #064e3b;
      --brand-medium: #10b981;
      --brand-light: #34d399;
      
      --text-main: #0f172a;
      --text-secondary: #334155;
      --text-muted: #64748b;
      
      --glass-bg: rgba(255, 255, 255, 0.95);
      --glass-border: rgba(255, 255, 255, 1);
      --card-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
      --card-shadow-hover: 0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04);
      
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      display: block;
      width: 100%;
    }

    .dashboard-container {
      position: relative;
      min-height: 100%;
      width: 100%;
      padding: 16px;
      overflow-x: hidden;
      overflow-y: auto;
      background: #f8fafc; /* Clean, modern slate background */
      box-sizing: border-box;
    }

    /* ── HIGH-CONTRAST AMBIENT BG NODES ── */
    .ambient-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      z-index: 0;
      pointer-events: none;
    }
    .blob-1 { top: -10%; left: 0%; width: 500px; height: 500px; background: rgba(52, 211, 153, 0.15); }
    .blob-2 { bottom: -10%; right: 0%; width: 600px; height: 600px; background: rgba(99, 102, 241, 0.08); }

    .dashboard-content {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 1200px; /* Slightly tighter for better readability */
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ── MODERN SHIELD GLASSMORPHISM PANELS ── */
    .glass-panel {
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      box-shadow: var(--card-shadow);
      transition: all 0.3s ease;
    }

    /* ── HEADER PANEL ── */
    .glass-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
    }

    .profile-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .avatar-wrapper {
      position: relative;
      display: inline-flex;
    }
    .avatar-wrapper .avatar-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .online-badge {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      background: #10b981;
      border: 2px solid #fff;
      border-radius: 50%;
    }

    .profile-info .username {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 4px;
      letter-spacing: -0.02em;
    }

    .verified-icon {
      color: var(--brand-medium);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .profile-info .role {
      margin: 2px 0 0;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .settings-btn {
      background: #ffffff !important;
      color: var(--text-secondary) !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 8px !important;
      padding: 0 12px !important;
      height: 32px !important;
      font-size: 0.8rem !important;
      font-weight: 600 !important;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
      transition: all 0.2s ease !important;
    }
    .settings-btn:hover {
      background: #f8fafc !important;
      border-color: #cbd5e1 !important;
      color: var(--text-main) !important;
    }

    /* ── SECTION TITLES ── */
    .section-heading {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 0;
    }
    .section-heading h2 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-secondary);
      margin: 0;
    }
    .heading-icon-box {
      width: 28px;
      height: 28px;
      background: var(--brand-medium);
      color: #fff;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
    }
    .heading-icon-box mat-icon { font-size: 18px; width: 18px; height: 18px; }

    /* ── ANALYTICS GRID ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 12px;
    }
    .stat-card {
      display: flex;
      align-items: center;
      padding: 16px 12px;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--card-shadow-hover);
    }
    .icon-blob {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
    }
    .primary .icon-blob { background: #f0f9ff; color: #0ea5e9; }
    .danger .icon-blob { background: #fef2f2; color: #ef4444; }
    .success .icon-blob { background: #f0fdf4; color: #22c55e; }
    .icon-blob mat-icon { font-size: 24px; width: 24px; height: 24px; }

    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.5rem; font-weight: 800; color: var(--text-main); line-height: 1.2; }
    .stat-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }

    /* ── INTERACTIVE WORKSPACE CARDS ── */
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
    }
    .action-card {
      display: flex;
      flex-direction: column;
      padding: 16px;
      text-align: center;
      align-items: center;
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }

    .action-card.core-feature {
      border: 1px solid #e2e8f0;
    }
    .action-card.core-feature .card-glow {
      position: absolute;
      top: 0; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg, var(--brand-medium), var(--brand-light));
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--card-shadow-hover);
      border-color: #cbd5e1;
    }

    .action-blob {
      width: 44px;
      height: 44px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      transition: transform 0.3s ease;
    }
    .action-card:hover .action-blob {
      transform: scale(1.05);
    }
    
    .primary-blob { background: var(--brand-medium); color: #fff; box-shadow: 0 8px 16px rgba(16, 185, 129, 0.2); }
    .secondary-blob { background: #f1f5f9; color: var(--text-secondary); }
    .action-blob mat-icon { font-size: 24px; width: 24px; height: 24px; }

    .action-text h3 { font-size: 1rem; font-weight: 700; color: var(--text-main); margin: 0 0 6px; }
    .action-text p { font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin: 0 0 12px; max-width: 400px; }

    .scan-now-btn {
      margin-top: auto;
      width: 100%;
      border-radius: 8px !important;
      font-size: 0.85rem !important;
      font-weight: 600 !important;
      height: 32px !important;
      background: var(--brand-medium) !important;
      color: #ffffff !important;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2) !important;
      transition: all 0.2s ease !important;
    }
    .scan-now-btn:hover {
      background: #059669 !important;
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3) !important;
    }

    .history-btn {
      margin-top: auto;
      width: 100%;
      border-radius: 8px !important;
      font-size: 0.85rem !important;
      font-weight: 600 !important;
      height: 32px !important;
      border: 1px solid #cbd5e1 !important;
      color: var(--text-secondary) !important;
      background: #ffffff !important;
      transition: all 0.2s ease !important;
    }
    .history-btn:hover {
      background: #f8fafc !important;
      border-color: #94a3b8 !important;
      color: var(--text-main) !important;
    }

    /* ── ANIMATION KEYFRAMES ── */
    .animate-fade-in { animation: fadeIn 0.5s ease forwards; }
    .animate-slide-up { animation: slideUp 0.5s ease forwards; }
    .animate-slide-up-delayed { animation: slideUp 0.6s ease forwards; }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ── RESPONSIVENESS ── */
    @media (max-width: 1024px) {
      .dashboard-container { padding: 16px; }
    }
    @media (max-width: 768px) {
      .glass-header { flex-direction: column; align-items: flex-start; gap: 16px; padding: 16px; }
      .header-actions { width: 100%; }
      .header-actions .settings-btn { width: 100%; justify-content: center; }
    }
  `]
})
export class FarmerDashboardComponent implements OnInit {
  userName: string = 'Farmer';
  totalScans: number = 0;
  diseaseAlerts: number = 0;
  healthyPlants: number = 0;

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.name) {
      this.userName = user.name;
    }

    this.http.get<any[]>(`${environment.apiUrl}/prediction/history`).subscribe({
      next: (history) => {
        this.totalScans = history.length;
        this.healthyPlants = history.filter(h => h.isHealthy).length;
        this.diseaseAlerts = this.totalScans - this.healthyPlants;
      },
      error: (err) => console.error('Failed to load history', err)
    });
  }
}