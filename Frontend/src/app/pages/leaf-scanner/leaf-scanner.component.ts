import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { environment } from '../../../environments/environment';
import { PredictionService } from '../../services/prediction.service';
import { LanguageService } from '../../services/language.service';
import { ToastService } from '../../services/toast.service';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';

interface PipelineStage {
  stage: string;
  result: string;
  modelUsed?: string;
  confidence?: number;
  elapsedMs: number;
}

interface DiagnosisResult {
  plantName: string;
  diseaseName: string;
  isHealthy: boolean;
  confidence: number;
  damagePercentage: number;
  diseaseDescription?: string;
  cure?: string;
  prevention?: string;
  fertilizerRecommendation?: string;
  diagnosisSource: string;
  pipelineStages: PipelineStage[];
  imagePath: string;
}

@Component({
  selector: 'app-leaf-scanner',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatDividerModule,
    LanguageSelectorComponent
  ],
  template: `
    <div class="scanner-container">
      <mat-card class="upload-card">
        <mat-card-header>
          <mat-card-title>
            AgriVision Leaf Scanner
            <div class="lang-wrapper">
              <app-language-selector></app-language-selector>
            </div>
          </mat-card-title>
          <mat-card-subtitle>Powered by AgriVision AI</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="upload-area" (click)="fileInput.click()" *ngIf="!selectedFile">
            <mat-icon class="upload-icon">cloud_upload</mat-icon>
            <p>Click or drag to upload leaf image</p>
          </div>

          <div class="preview-area" *ngIf="selectedFile">
            <img [src]="previewUrl" class="preview-img">
            <button mat-mini-fab color="warn" class="remove-btn" (click)="reset()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" hidden>
          
          <div class="action-bar" *ngIf="selectedFile && !isAnalyzing">
            <button mat-raised-button color="primary" (click)="analyze()">
              <mat-icon>psychology</mat-icon> Start Diagnosis
            </button>
          </div>

          <div class="analyzing-area" *ngIf="isAnalyzing">
            <mat-progress-bar mode="indeterminate"></mat-progress-bar>
            <p class="status-text">AgriVision is analyzing your image...</p>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- RESULTS SECTION -->
      <div class="results-container" *ngIf="result">
        <mat-card class="result-card" [class.healthy]="result.isHealthy">
          <div class="result-header">
            <mat-icon class="status-icon">{{ result.isHealthy ? 'check_circle' : 'warning' }}</mat-icon>
            <div class="title-group">
              <h2>{{ result.plantName }} - {{ result.diseaseName }}</h2>
              <span class="source-badge">Engine: {{ result.diagnosisSource }}</span>
            </div>
          </div>

          <div class="pipeline-trace">
            <h3>Pipeline Trail</h3>
            <div class="stage-flow">
              <div class="stage-item" *ngFor="let stage of result.pipelineStages">
                <div class="stage-dot"></div>
                <div class="stage-info">
                  <span class="stage-name">{{ stage.stage }}</span>
                  <span class="stage-result">{{ stage.result }}</span>
                  <small>{{ stage.modelUsed }} ({{ stage.elapsedMs }}ms)</small>
                </div>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="diagnosis-details">
            <div class="detail-item">
              <span class="label">Confidence</span>
              <div class="progress-container">
                <mat-progress-bar mode="determinate" [value]="result.confidence * 100"></mat-progress-bar>
                <span>{{ (result.confidence * 100) | number:'1.0-1' }}%</span>
              </div>
            </div>
          </div>

          <mat-expansion-panel class="treatment-panel" [expanded]="true">
            <mat-expansion-panel-header>
              <mat-panel-title>Treatment & Prevention</mat-panel-title>
            </mat-expansion-panel-header>
            
            <div class="treatment-content">
              <h4>Description</h4>
              <p>{{ result.diseaseDescription || 'No description available.' }}</p>
              
              <h4>Cure</h4>
              <p>{{ result.cure || 'Consult an agricultural expert.' }}</p>
              
              <h4>Prevention</h4>
              <p>{{ result.prevention || 'General care practices recommended.' }}</p>
              
              <h4>Fertilizer Recommendation</h4>
              <p>{{ result.fertilizerRecommendation || 'Balanced NPK recommended.' }}</p>
            </div>
          </mat-expansion-panel>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .scanner-container { padding: 2rem; max-width: 800px; margin: 0 auto; font-family: 'Inter', sans-serif; }
    mat-card-title { display: flex; justify-content: space-between; align-items: center; width: 100%; }
    .lang-wrapper { transform: scale(0.9); transform-origin: right center; }
    .upload-card { border-radius: 16px; border: 1px dashed #ccc; box-shadow: none; margin-top: 1rem; }
    .upload-area { height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; color: #666; }
    .upload-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 1rem; }
    .preview-area { position: relative; margin: 1rem 0; border-radius: 8px; overflow: hidden; }
    .preview-img { width: 100%; max-height: 400px; object-fit: cover; }
    .remove-btn { position: absolute; top: 10px; right: 10px; }
    .action-bar { display: flex; justify-content: center; margin-top: 1rem; }
    .analyzing-area { margin-top: 1.5rem; text-align: center; }
    .status-text { margin-top: 0.5rem; font-style: italic; color: #1976d2; }

    .results-container { margin-top: 2rem; animation: slideUp 0.5s ease-out; }
    .result-card { border-radius: 16px; padding: 1.5rem; border-left: 8px solid #f44336; }
    .result-card.healthy { border-left-color: #4caf50; }
    
    .result-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .status-icon { font-size: 40px; width: 40px; height: 40px; }
    .healthy .status-icon { color: #4caf50; }
    .result-card:not(.healthy) .status-icon { color: #f44336; }
    .title-group h2 { margin: 0; font-weight: 800; color: #334155; }
    .source-badge { font-size: 0.75rem; background: #e2e8f0; padding: 2px 8px; border-radius: 4px; color: #64748b; font-weight: 600; }

    .pipeline-trace { margin: 1rem 0; background: #f8fafc; padding: 1rem; border-radius: 12px; }
    .pipeline-trace h3 { font-size: 0.9rem; text-transform: uppercase; color: #94a3b8; margin-bottom: 1rem; letter-spacing: 1px; }
    .stage-flow { display: flex; flex-direction: column; gap: 1rem; }
    .stage-item { display: flex; gap: 1rem; position: relative; }
    .stage-dot { width: 12px; height: 12px; border-radius: 50%; background: #1976d2; margin-top: 4px; flex-shrink: 0; }
    .stage-info { display: flex; flex-direction: column; }
    .stage-name { font-weight: 700; color: #1e293b; font-size: 0.95rem; }
    .stage-result { color: #1976d2; font-weight: 600; }
    .stage-info small { color: #94a3b8; }

    .diagnosis-details { margin: 1.5rem 0; }
    .detail-item { display: flex; flex-direction: column; gap: 0.5rem; }
    .label { font-weight: 600; color: #64748b; }
    .progress-container { display: flex; align-items: center; gap: 1rem; }
    .progress-container mat-progress-bar { flex: 1; height: 8px; border-radius: 4px; }

    .treatment-panel { margin-top: 1rem; box-shadow: none; border: 1px solid #e2e8f0; border-radius: 12px !important; }
    .treatment-content h4 { margin: 1rem 0 0.5rem; color: #1976d2; font-size: 0.95rem; }
    .treatment-content p { color: #334155; line-height: 1.5; margin-bottom: 1rem; }

    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class LeafScannerComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isAnalyzing = false;
  result: DiagnosisResult | null = null;

  constructor(
    private predictionService: PredictionService,
    private languageService: LanguageService,
    private toast: ToastService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  analyze() {
    if (!this.selectedFile) return;

    this.isAnalyzing = true;
    this.result = null;

    const language = this.languageService.getCurrentLanguageName();

    this.predictionService.predictFromImage(this.selectedFile, language).subscribe({
      next: (res: any) => {
        this.result = res;
        this.isAnalyzing = false;
        this.toast.success('Diagnosis complete! Results are ready.', 'Analysis Done');
      },
      error: (err) => {
        console.error(err);
        this.isAnalyzing = false;
        this.toast.error('Analysis failed. Please try with a different image.', 'Analysis Error');
      }
    });
  }

  reset() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.result = null;
  }
}
