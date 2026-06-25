import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicTranslatePipe } from '../../shared/pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-prediction-result',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterModule,
    TranslateModule,
    DecimalPipe,
    DatePipe,
    DynamicTranslatePipe
  ],
  template: `
    <!-- ── RESULT PAGE ── -->
    <div class="result-page" *ngIf="prediction">

      <!-- TOP BANNER -->
      <div class="top-banner" [class.banner-healthy]="prediction.isHealthy" [class.banner-diseased]="!prediction.isHealthy && prediction.predictedDisease !== 'Unknown'" [class.banner-unknown]="prediction.predictedDisease === 'Unknown'">
        <div class="banner-inner">
          <div class="banner-left">
            <mat-icon class="banner-icon">{{ prediction.predictedDisease === 'Unknown' ? 'help_outline' : (prediction.isHealthy ? 'eco' : 'coronavirus') }}</mat-icon>
            <div>
              <div class="banner-label">{{ 'RESULT.TITLE' | translate }}</div>
              <div class="banner-disease">{{ prediction.predictedDisease === 'Unknown' ? 'Unknown Condition' : (prediction.predictedDisease | dynamicTranslate) }}</div>
            </div>
          </div>
          <div class="banner-status-chip">
            <mat-icon>{{ prediction.predictedDisease === 'Unknown' ? 'warning' : (prediction.isHealthy ? 'check_circle' : 'warning') }}</mat-icon>
            {{ prediction.predictedDisease === 'Unknown' ? 'UNKNOWN' : (prediction.isHealthy ? 'HEALTHY' : 'DISEASED') }}
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT GRID -->
      <div class="content-grid">

        <!-- LEFT: Image + Confidence + Plant Info -->
        <div class="left-col">
          <div class="crop-img-wrapper">
            <img [src]="'http://localhost:5063/' + prediction.imagePath"
                 alt="Scanned Crop" (error)="onImgError($event)" class="crop-img">
          </div>

          <div class="plant-info-box">
            <div class="pi-row">
              <mat-icon>local_florist</mat-icon>
              <div class="pi-data">
                <span class="pi-label">{{ 'RESULT.PLANT_CROP' | translate }}</span>
                <span class="pi-value">{{ (prediction.plantName | dynamicTranslate) || ('RESULT.GENERAL_CROP' | translate) }}</span>
              </div>
            </div>
            <mat-divider></mat-divider>
            <div class="pi-row">
              <mat-icon>calendar_today</mat-icon>
              <div class="pi-data">
                <span class="pi-label">{{ 'HISTORY.DATE' | translate }}</span>
                <span class="pi-value">{{ (prediction.createdAt | date:'dd MMM yyyy') || ('Just Now' | translate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: All Diagnostic Fields -->
        <div class="right-col">

          <ng-container *ngIf="prediction.predictedDisease !== 'Unknown'; else unknownState">
            <!-- 1. DISEASE DESCRIPTION -->
            <div class="field-card">
              <div class="field-header">
                <span class="fh-icon icon-desc"><mat-icon>info</mat-icon></span>
                <span class="field-title">{{ 'RESULT.DISEASE_DESCRIPTION' | translate }}</span>
              </div>
              <p class="field-body">
                {{ (prediction.diseaseDescription | dynamicTranslate) || 'No description available for this condition. Please consult an agricultural expert for a detailed assessment.' }}
              </p>
            </div>

            <!-- 2. TREATMENT PLAN -->
            <div class="field-card">
              <div class="field-header">
                <span class="fh-icon icon-cure"><mat-icon>healing</mat-icon></span>
                <span class="field-title">{{ 'RESULT.TREATMENT_PLAN' | translate }}</span>
              </div>
              <p class="field-body">
                {{ (prediction.cure | dynamicTranslate) || 'No specific treatment found. Monitor the plant closely and maintain good agricultural practices.' }}
              </p>
            </div>

            <!-- 3. PREVENTION STRATEGY -->
            <div class="field-card">
              <div class="field-header">
                <span class="fh-icon icon-prevent"><mat-icon>shield</mat-icon></span>
                <span class="field-title">{{ 'RESULT.PREVENTION_STRATEGY' | translate }}</span>
              </div>
              <p class="field-body">
                {{ (prediction.prevention | dynamicTranslate) || 'Maintain good crop hygiene, regular monitoring, proper spacing, and irrigation management to prevent disease spread.' }}
              </p>
            </div>

            <!-- 4. FERTILIZER RECOMMENDATION -->
            <div class="field-card">
              <div class="field-header">
                <span class="fh-icon icon-fert"><mat-icon>science</mat-icon></span>
                <span class="field-title">{{ 'RESULT.FERTILIZER_RECOMMENDATION' | translate }}</span>
              </div>
              <p class="field-body">
                <strong>{{ 'RESULT.FERTILIZER_RECOMMENDATION' | translate }}:</strong> {{ (prediction.fertilizer | dynamicTranslate) || 'Balanced NPK (10-10-10)' }}<br>
                <span *ngIf="prediction.recommendation?.applicationRate">
                  <strong>{{ 'RESULT.APPLICATION_RATE' | translate }}:</strong> {{ prediction.recommendation.applicationRate | dynamicTranslate }}
                </span>
              </p>
            </div>
          </ng-container>
          
          <ng-template #unknownState>
            <div class="unknown-state-box">
              <mat-icon class="unknown-icon">warning</mat-icon>
              <h3>Unable to identify the disease.</h3>
              <p>Please upload a clearer image for accurate diagnosis.</p>
            </div>
          </ng-template>

          <!-- ACTION BUTTONS -->
          <div class="action-row">
            <button mat-stroked-button class="act-btn" routerLink="/crop-upload">
              <mat-icon>{{ prediction.predictedDisease === 'Unknown' ? 'replay' : 'arrow_back' }}</mat-icon> 
              {{ prediction.predictedDisease === 'Unknown' ? ('Retake Image' | translate) : ('COMMON.BACK_TO_DASHBOARD' | translate) }}
            </button>
            <button mat-flat-button color="primary" class="act-btn" routerLink="/crop-upload">
              <mat-icon>add_a_photo</mat-icon> {{ 'RESULT.SCAN_ANOTHER' | translate }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div class="empty-state" *ngIf="!prediction">
      <mat-icon>image_search</mat-icon>
      <h2>No Scan Result</h2>
      <p>Please upload a crop image first to get an AI diagnostic report.</p>
      <button mat-flat-button color="primary" routerLink="/crop-upload">
        Go to Scanner
      </button>
    </div>
  `,
  styles: [`
    :host {
      --green: #10b981;
      --red: #ef4444;
      --blue: #3b82f6;
      --orange: #f59e0b;
      --indigo: #6366f1;
      --text: #1e293b;
      --muted: #64748b;
      --border: #e2e8f0;
      display: block;
      font-family: 'Inter', Roboto, sans-serif;
      background: #f8fafc;
    }

    /* ── TOP BANNER ── */
    .top-banner { padding: 28px 32px; color: white; }
    .banner-diseased { background: linear-gradient(135deg, #991b1b, #ef4444); }
    .banner-healthy  { background: linear-gradient(135deg, #065f46, #10b981); }
    .banner-unknown  { background: linear-gradient(135deg, #854d0e, #eab308); }

    .banner-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
    }

    .banner-left { display: flex; align-items: center; gap: 20px; }

    .banner-icon { font-size: 32px; width: 32px; height: 32px; opacity: 0.9; }

    .banner-label {
      font-size: 0.75rem;
      opacity: 0.85;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .banner-disease { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.5px; }

    .banner-status-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.2);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 1px;
      border: 1px solid rgba(255,255,255,0.35);
    }

    /* ── CONTENT GRID ── */
    .content-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 28px;
      padding: 28px 32px;
      max-width: 1400px;
      margin: 0 auto;
      align-items: start;
    }

    /* ── LEFT COLUMN ── */
    .left-col { display: flex; flex-direction: column; gap: 20px; }

    .crop-img-wrapper {
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 4 / 3;
      background: #000;
      border: 1px solid var(--border);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
    .crop-img { width: 100%; height: 100%; object-fit: cover; display: block; }


    .plant-info-box {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    .pi-row { display: flex; align-items: center; gap: 18px; padding: 22px 24px; }
    .pi-row mat-icon { color: var(--green); font-size: 30px; width: 30px; height: 30px; }
    .pi-data { display: flex; flex-direction: column; }
    .pi-label { font-size: 0.75rem; color: var(--muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .pi-value { font-size: 0.95rem; font-weight: 700; color: var(--text); margin-top: 2px; }

    /* ── RIGHT COLUMN ── */
    .right-col { display: flex; flex-direction: column; gap: 20px; }

    .field-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 28px 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .field-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 18px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .fh-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      flex-shrink: 0;
    }
    .fh-icon mat-icon { font-size: 16px; width: 16px; height: 16px; }

    .icon-desc    { color: var(--indigo); background: #eef2ff; }
    .icon-cure    { color: var(--red);    background: #fef2f2; }
    .icon-prevent { color: var(--blue);   background: #eff6ff; }
    .icon-fert    { color: var(--green);  background: #f0fdf4; }

    .field-title { font-size: 0.95rem; font-weight: 700; color: var(--text); }

    .field-body {
      font-size: 0.8rem;
      line-height: 1.5;
      color: #374151;
      margin: 0;
    }

    /* ── ACTIONS ── */
    .action-row { display: flex; gap: 12px; padding-top: 4px; }
    .act-btn { flex: 1; height: 32px; font-size: 0.8rem; font-weight: 600; border-radius: 6px; }

    /* ── UNKNOWN STATE BOX ── */
    .unknown-state-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .unknown-icon { font-size: 64px; width: 64px; height: 64px; color: #f59e0b; margin-bottom: 20px; }
    .unknown-state-box h3 { font-size: 1.5rem; font-weight: 700; color: #92400e; margin: 0 0 10px; }
    .unknown-state-box p { font-size: 1.1rem; color: #b45309; margin: 0; line-height: 1.6; }

    /* ── EMPTY STATE ── */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
    }
    .empty-state mat-icon { font-size: 72px; width: 72px; height: 72px; color: #cbd5e1; margin-bottom: 24px; }
    .empty-state h2 { font-size: 1.75rem; font-weight: 700; margin: 0 0 12px; color: var(--text); }
    .empty-state p  { color: var(--muted); font-size: 1.05rem; margin-bottom: 28px; }

    /* ── RESPONSIVE ── */
    @media (max-width: 1100px) {
      .content-grid { grid-template-columns: 320px 1fr; padding: 20px 24px; }
      .banner-disease { font-size: 2.1rem; }
    }
    @media (max-width: 900px) {
      .content-grid { grid-template-columns: 1fr; }
      .banner-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
    }
    @media (max-width: 600px) {
      .top-banner { padding: 20px; }
      .content-grid { padding: 16px; gap: 16px; }
      .banner-disease { font-size: 1.6rem; }
      .field-card { padding: 20px; }
      .action-row { flex-direction: column; }
    }
  `]
})
export class PredictionResultComponent implements OnInit {
  prediction: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.prediction = navigation?.extras.state?.['prediction'];
  }

  ngOnInit(): void {
    if (!this.prediction) {
      console.warn('No prediction data in navigation state.');
    }
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/placeholder-leaf.png';
  }
}
