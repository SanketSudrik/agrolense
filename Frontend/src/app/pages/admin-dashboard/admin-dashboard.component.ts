import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, TranslateModule],
  template: `
    <div class="dashboard-container">
      <h1 class="page-title">{{ 'DASHBOARD.ADMIN_TITLE' | translate }}</h1>
      
      <div class="stats-grid">
        <mat-card class="stat-card users">
          <mat-card-header>
            <mat-icon mat-card-avatar>people</mat-icon>
            <mat-card-title>{{ stats?.totalUsers || 0 }}</mat-card-title>
            <mat-card-subtitle>{{ 'DASHBOARD.TOTAL_USERS' | translate }}</mat-card-subtitle>
          </mat-card-header>
        </mat-card>

        <mat-card class="stat-card predictions">
          <mat-card-header>
            <mat-icon mat-card-avatar>assessment</mat-icon>
            <mat-card-title>{{ stats?.totalPredictions || 0 }}</mat-card-title>
            <mat-card-subtitle>{{ 'DASHBOARD.TOTAL_PREDICTIONS' | translate }}</mat-card-subtitle>
          </mat-card-header>
        </mat-card>

        <mat-card class="stat-card diseases">
          <mat-card-header>
            <mat-icon mat-card-avatar>bug_report</mat-icon>
            <mat-card-title>{{ stats?.totalDiseases || 0 }}</mat-card-title>
            <mat-card-subtitle>{{ 'DASHBOARD.TOTAL_DISEASES' | translate }}</mat-card-subtitle>
          </mat-card-header>
        </mat-card>

        <mat-card class="stat-card crops">
          <mat-card-header>
            <mat-icon mat-card-avatar>eco</mat-icon>
            <mat-card-title>{{ stats?.totalCrops || 0 }}</mat-card-title>
            <mat-card-subtitle>{{ 'DASHBOARD.TOTAL_CROPS' | translate }}</mat-card-subtitle>
          </mat-card-header>
        </mat-card>
      </div>

      <div class="management-section">
        <h2>{{ 'DASHBOARD.SYSTEM_MANAGEMENT' | translate }}</h2>
        <div class="actions-grid">
          <button mat-flat-button color="primary">Manage Users</button>
          <button mat-flat-button color="accent">Manage Diseases</button>
          <button mat-flat-button>System Logs</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 20px; }
    .page-title { margin-bottom: 30px; font-weight: 300; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .stat-card { padding: 15px; border-radius: 12px; color: white; }
    .stat-card.users { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-card.predictions { background: linear-gradient(135deg, #2af598 0%, #009efd 100%); }
    .stat-card.diseases { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-card.crops { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
    .management-section { margin-top: 40px; }
    .actions-grid { display: flex; gap: 15px; }
    mat-icon { font-size: 40px; width: 40px; height: 40px; margin-bottom: 10px; opacity: 0.8; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/admin/dashboard`).subscribe(res => {
      this.stats = res;
    });
  }
}
