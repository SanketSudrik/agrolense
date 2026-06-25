import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DynamicTranslatePipe } from '../../shared/pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-prediction-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, TranslateModule, DynamicTranslatePipe],
  template: `
    <div class="history-wrapper">
      <div class="header-section">
        <h1 class="page-title">{{ 'HISTORY.TITLE' | translate }}</h1>
        <p class="subtitle">{{ 'HISTORY.HISTORY_SUBTITLE' | translate }}</p>
      </div>

      <div class="table-container glass-card">
        <table mat-table [dataSource]="history" class="premium-table">
          <!-- Date Column -->
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>{{ 'HISTORY.DATE' | translate }}</th>
            <td mat-cell *matCellDef="let element">
              <div class="date-cell">
                <mat-icon class="small-icon">calendar_today</mat-icon>
                {{ element.createdAt | date:'mediumDate' }}
              </div>
            </td>
          </ng-container>

          <!-- Image Column -->
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef>{{ 'HISTORY.IMAGE' | translate }}</th>
            <td mat-cell *matCellDef="let element">
              <div class="img-wrapper">
                <img [src]="'http://localhost:5063/' + element.imagePath" class="thumbnail" alt="Crop">
              </div>
            </td>
          </ng-container>

          <!-- Disease Column -->
          <ng-container matColumnDef="disease">
            <th mat-header-cell *matHeaderCellDef>{{ 'HISTORY.DISEASE' | translate }}</th>
            <td mat-cell *matCellDef="let element">
              <span class="disease-badge" 
                [class.healthy]="element.predictedDisease?.toLowerCase().includes('healthy')"
                [class.unknown]="element.predictedDisease === 'Unknown'">
                {{ element.predictedDisease | dynamicTranslate }}
              </span>
            </td>
          </ng-container>


          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="text-right">{{ 'COMMON.ACTIONS' | translate }}</th>
            <td mat-cell *matCellDef="let element" class="text-right">
              <button mat-icon-button class="action-btn" (click)="viewDetails(element)" matTooltip="View Details">
                <mat-icon>visibility</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
        </table>

        <div class="no-history" *ngIf="history.length === 0">
          <mat-icon class="empty-icon">inbox</mat-icon>
          <p>{{ 'HISTORY.NO_DATA' | translate }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .history-wrapper {
      padding: 0;
      font-family: 'Inter', sans-serif;
    }
    
    .header-section {
      background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%);
      margin: -24px -24px 30px -24px;
      padding: 40px;
      color: white;
      border-radius: 0 0 20px 20px;
      box-shadow: 0 4px 20px rgba(13, 71, 161, 0.15);
    }
    
    .page-title { margin: 0 0 5px 0; font-size: 2rem; font-weight: 800; }
    .subtitle { margin: 0; opacity: 0.9; }

    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
      padding: 20px;
      border: 1px solid rgba(0,0,0,0.05);
      overflow-x: auto;
    }

    .premium-table {
      width: 100%;
      background: transparent;
    }

    .mat-mdc-header-cell {
      color: #64748b;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #f1f5f9;
      padding: 16px;
    }

    .mat-mdc-cell {
      padding: 16px;
      color: #334155;
      font-weight: 500;
      border-bottom: 1px solid #f1f5f9;
    }

    .table-row {
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background-color: #f8fafc;
    }

    .date-cell { display: flex; align-items: center; gap: 8px; color: #475569; }
    .small-icon { font-size: 16px; width: 16px; height: 16px; opacity: 0.7; }

    .img-wrapper {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    
    .table-row:hover .thumbnail { transform: scale(1.1); }

    .disease-badge {
      display: inline-block;
      padding: 6px 12px;
      background: #fee2e2;
      color: #ef4444;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .disease-badge.healthy {
      background: #dcfce7;
      color: #16a34a;
    }

    .disease-badge.unknown {
      background: #fef9c3;
      color: #854d0e;
    }

    .confidence-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .conf-bar-bg {
      width: 80px;
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .conf-bar {
      height: 100%;
      background: #f59e0b;
      border-radius: 4px;
    }
    .conf-bar.high { background: #10b981; }

    .action-btn {
      color: #3b82f6;
      background: #eff6ff;
      transition: all 0.2s;
    }
    
    .action-btn:hover {
      background: #3b82f6;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
    }

    .text-right { text-align: right; }

    .no-history {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 20px;
      color: #94a3b8;
    }
    
    .empty-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; opacity: 0.5; }
  `]
})
export class PredictionHistoryComponent implements OnInit {
  history: any[] = [];
  displayedColumns: string[] = ['date', 'image', 'disease', 'actions'];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.http.get<any[]>(`${environment.apiUrl}/prediction/history`).subscribe(res => {
      this.history = res;
    });
  }

  viewDetails(element: any): void {
    this.router.navigate(['/prediction-result'], { state: { prediction: element } });
  }
}
