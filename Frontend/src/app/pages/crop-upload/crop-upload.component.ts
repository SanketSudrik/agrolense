import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../services/toast.service';
import { LanguageService } from '../../services/language.service';
import { PredictionService } from '../../services/prediction.service';

import { DynamicTranslatePipe } from '../../shared/pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-crop-upload',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslateModule, DynamicTranslatePipe],
  template: `
    <div class="upload-container">
      <div class="header-section">
        <span class="badge">{{ 'AI Diagnostic' | dynamicTranslate }}</span>
        <h1>{{ 'Analyze Crop Health' | dynamicTranslate }}</h1>
      </div>

      <div class="grid-container">
        
        <!-- LEFT PANEL: Image / Drop Zone -->
        <mat-card class="panel image-panel">
          <div class="drop-zone" (click)="fileInput.click()" [class.has-image]="previewUrl">
            <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" hidden>
            
            <div class="placeholder-content" *ngIf="!previewUrl">
              <mat-icon class="upload-icon">add_photo_alternate</mat-icon>
              <h2>{{ 'Select or Drop Image' | dynamicTranslate }}</h2>
              <p>{{ 'Upload a clear photo of your crop to identify diseases.' | dynamicTranslate }}</p>
              <button mat-stroked-button color="primary" (click)="$event.stopPropagation(); fileInput.click()">
                {{ 'Browse Gallery' | dynamicTranslate }}
              </button>
            </div>

            <div class="preview-stage" *ngIf="previewUrl">
              <img [src]="previewUrl" class="img-fluid">
              <div class="scan-overlay" *ngIf="isUploading">
                <div class="scan-line"></div>
              </div>
              <button class="btn-reset" (click)="$event.stopPropagation(); reset()" *ngIf="!isUploading">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>
        </mat-card>

        <!-- RIGHT PANEL: Actions & Context -->
        <div class="panel actions-panel">
          <mat-card class="control-box">
            <div class="status-msg" *ngIf="!selectedFile">
              <mat-icon>info</mat-icon>
              <span>{{ 'Please select an image first' | dynamicTranslate }}</span>
            </div>
            <div class="status-msg success" *ngIf="selectedFile && !isUploading">
              <mat-icon>check_circle</mat-icon>
              <span>{{ 'Image ready for analysis' | dynamicTranslate }}</span>
            </div>

            <button mat-flat-button color="primary" class="btn-analyze" 
                    (click)="upload()" 
                    [disabled]="!selectedFile || isUploading">
              <mat-icon *ngIf="!isUploading">analytics</mat-icon>
              <span *ngIf="!isUploading">{{ 'Run AI Diagnosis' | dynamicTranslate }}</span>
              <span *ngIf="isUploading">{{ 'Analyzing...' | dynamicTranslate }}</span>
            </button>
          </mat-card>

          <!-- PRO TIPS -->
          <div class="tips-grid">
            <mat-card class="tip-card">
              <mat-icon color="primary">wb_sunny</mat-icon>
              <div class="tip-body">
                <strong>{{ 'Lighting' | dynamicTranslate }}</strong>
                <p>{{ 'Ensure the leaf is well lit.' | dynamicTranslate }}</p>
              </div>
            </mat-card>
            <mat-card class="tip-card">
              <mat-icon color="primary">center_focus_strong</mat-icon>
              <div class="tip-body">
                <strong>{{ 'Focus' | dynamicTranslate }}</strong>
                <p>{{ 'Keep the diseased area in focus.' | dynamicTranslate }}</p>
              </div>
            </mat-card>
          </div>
        </div>

      </div>
      <mat-progress-bar mode="indeterminate" *ngIf="isUploading" class="fixed-progress"></mat-progress-bar>
    </div>
  `,
  styles: [`
    :host {
      --bg-color: #f8fafc;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --primary-color: #10b981;
      font-family: 'Inter', Roboto, "Helvetica Neue", sans-serif;
    }

    .upload-container {
      min-height: 100vh;
      background: var(--bg-color);
      padding: 40px 24px;
      color: var(--text-primary);
    }

    .header-section {
      max-width: 1000px;
      margin: 0 auto 24px;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: #ecfdf5;
      color: var(--primary-color);
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .header-section h1 {
      font-size: 2rem;
      margin: 0;
      font-weight: 700;
    }

    .grid-container {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;
      max-width: 1000px;
      margin: 0 auto;
      align-items: start;
    }

    /* ── LEFT PANEL ── */
    .image-panel {
      padding: 0;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }

    .drop-zone {
      width: 100%;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      background: #f1f5f9;
      transition: background 0.2s;
    }
    
    .drop-zone:hover:not(.has-image) {
      background: #e2e8f0;
    }

    .placeholder-content {
      text-align: center;
      padding: 32px;
    }

    .upload-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #94a3b8;
      margin-bottom: 16px;
    }

    .placeholder-content h2 {
      font-size: 1.25rem;
      margin: 0 0 8px;
      font-weight: 600;
    }
    
    .placeholder-content p {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-bottom: 24px;
    }

    .preview-stage {
      width: 100%;
      height: 100%;
      background: #000;
      position: relative;
    }
    
    .img-fluid {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .btn-reset {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(0,0,0,0.6);
      color: white;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .scan-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: rgba(16, 185, 129, 0.1);
    }
    
    .scan-line {
      width: 100%;
      height: 2px;
      background: var(--primary-color);
      box-shadow: 0 0 8px var(--primary-color);
      position: absolute;
      top: 0;
      animation: scan 2.5s linear infinite;
    }
    
    @keyframes scan { 
      0% { top: 0; } 
      50% { top: 100%; } 
      100% { top: 0; } 
    }

    /* ── RIGHT PANEL ── */
    .actions-panel {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .control-box {
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }

    .status-msg {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      color: var(--text-secondary);
      font-size: 0.95rem;
      font-weight: 500;
    }
    
    .status-msg.success {
      color: var(--primary-color);
    }

    .btn-analyze {
      width: 100%;
      height: 48px;
      font-size: 1.05rem;
      font-weight: 600;
      border-radius: 8px;
    }

    .tips-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .tip-card {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    
    .tip-body {
      display: flex;
      flex-direction: column;
    }
    
    .tip-body strong {
      font-size: 0.95rem;
      font-weight: 600;
    }
    
    .tip-body p {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin: 4px 0 0;
    }

    .fixed-progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 991px) {
      .grid-container { grid-template-columns: 1fr; }
      .image-panel { margin-bottom: 24px; }
      .drop-zone { height: 350px; }
    }
    
    @media (max-width: 768px) {
      .upload-container { padding: 24px 16px; }
      .drop-zone { height: 300px; }
      .header-section h1 { font-size: 1.6rem; }
    }
  `]
})
export class CropUploadComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isUploading = false;

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private toast: ToastService,
    private languageService: LanguageService,
    private predictionService: PredictionService
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  upload(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    const language = this.languageService.getCurrentLanguageName();

    this.predictionService.predictFromImage(this.selectedFile, language).subscribe({
      next: (res: any) => {
        this.isUploading = false;
        this.toast.success('Analysis complete! Viewing results.', 'Diagnosis Ready');
        // Navigate to result page with prediction data
        this.router.navigate(['/prediction-result'], { state: { prediction: res } });
      },
      error: (err) => {
        this.isUploading = false;
        console.error('Upload failed', err);
        this.toast.error('Prediction failed. Please try again.', 'Upload Error');
      }
    });
  }

  reset(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.isUploading = false;
  }
}
