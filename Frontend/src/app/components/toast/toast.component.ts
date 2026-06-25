import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ToastService, ToastData } from '../../services/toast.service';
import { Subscription } from 'rxjs';

interface ActiveToast extends ToastData {
  id: number;
  state: 'enter' | 'leave';
  timerId?: any;
  progressTimerId?: any;
  progress: number; // 100 → 0
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  animations: [
    trigger('toastAnim', [
      state('enter', style({ opacity: 1, transform: 'translateX(0)' })),
      state('leave', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition('void => enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('350ms cubic-bezier(0.21, 1.02, 0.73, 1)')
      ]),
      transition('enter => leave', [
        animate('250ms cubic-bezier(0.06, 0.71, 0.55, 1)')
      ])
    ])
  ],
  template: `
    <div class="toast-container" aria-live="polite">
      @for (toast of toasts; track toast.id) {
        <div class="toast-item" [class]="'toast-' + toast.type" [@toastAnim]="toast.state"
             (@toastAnim.done)="onAnimDone($event, toast)">
          <div class="toast-icon-wrapper">
            <mat-icon>{{ getIcon(toast.type) }}</mat-icon>
          </div>
          <div class="toast-body">
            @if (toast.title) {
              <span class="toast-title">{{ toast.title }}</span>
            }
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button class="toast-close" (click)="dismiss(toast)" aria-label="Close notification">
            <mat-icon>close</mat-icon>
          </button>
          <div class="toast-progress">
            <div class="toast-progress-bar" [style.width.%]="toast.progress"></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 420px;
      width: calc(100vw - 48px);
      pointer-events: none;
    }

    .toast-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px 14px 14px;
      border-radius: 12px;
      background: #ffffff;
      box-shadow:
        0 12px 28px rgba(0, 0, 0, 0.12),
        0 4px 10px rgba(0, 0, 0, 0.06);
      border-left: 4px solid transparent;
      pointer-events: all;
      position: relative;
      overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      backdrop-filter: blur(8px);
    }

    /* ── Type Colors ── */
    .toast-success {
      border-left-color: #10b981;
      background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
    }
    .toast-success .toast-icon-wrapper {
      background: #ecfdf5;
      color: #059669;
    }
    .toast-success .toast-progress-bar {
      background: linear-gradient(90deg, #10b981, #34d399);
    }

    .toast-error {
      border-left-color: #ef4444;
      background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
    }
    .toast-error .toast-icon-wrapper {
      background: #fef2f2;
      color: #dc2626;
    }
    .toast-error .toast-progress-bar {
      background: linear-gradient(90deg, #ef4444, #f87171);
    }

    .toast-warning {
      border-left-color: #f59e0b;
      background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
    }
    .toast-warning .toast-icon-wrapper {
      background: #fffbeb;
      color: #d97706;
    }
    .toast-warning .toast-progress-bar {
      background: linear-gradient(90deg, #f59e0b, #fbbf24);
    }

    .toast-info {
      border-left-color: #3b82f6;
      background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
    }
    .toast-info .toast-icon-wrapper {
      background: #eff6ff;
      color: #2563eb;
    }
    .toast-info .toast-progress-bar {
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
    }

    /* ── Icon ── */
    .toast-icon-wrapper {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .toast-icon-wrapper mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* ── Body ── */
    .toast-body {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      min-width: 0;
      padding-top: 2px;
    }
    .toast-title {
      font-weight: 700;
      font-size: 0.88rem;
      color: #1e293b;
      line-height: 1.3;
    }
    .toast-message {
      font-size: 0.82rem;
      color: #64748b;
      line-height: 1.4;
      word-break: break-word;
    }

    /* ── Close ── */
    .toast-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .toast-close:hover {
      background: rgba(0, 0, 0, 0.06);
      color: #475569;
    }
    .toast-close mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* ── Progress Bar ── */
    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(0, 0, 0, 0.04);
    }
    .toast-progress-bar {
      height: 100%;
      border-radius: 0 2px 2px 0;
      transition: width 100ms linear;
    }

    /* ── Responsive ── */
    @media (max-width: 480px) {
      .toast-container {
        top: 12px;
        right: 12px;
        width: calc(100vw - 24px);
      }
      .toast-item {
        padding: 12px 14px 12px 12px;
      }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: ActiveToast[] = [];
  private sub!: Subscription;
  private idCounter = 0;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toastService.toast$.subscribe(data => {
      this.addToast(data);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.toasts.forEach(t => {
      clearTimeout(t.timerId);
      clearInterval(t.progressTimerId);
    });
  }

  private addToast(data: ToastData): void {
    const duration = data.duration ?? 4000;
    const toast: ActiveToast = {
      ...data,
      id: ++this.idCounter,
      state: 'enter',
      progress: 100
    };

    this.toasts.push(toast);

    // Keep max 5 toasts visible
    if (this.toasts.length > 5) {
      this.dismiss(this.toasts[0]);
    }

    // Progress countdown
    const intervalMs = 50;
    const step = (100 / duration) * intervalMs;
    toast.progressTimerId = setInterval(() => {
      toast.progress = Math.max(0, toast.progress - step);
    }, intervalMs);

    // Auto dismiss
    toast.timerId = setTimeout(() => {
      this.dismiss(toast);
    }, duration);
  }

  dismiss(toast: ActiveToast): void {
    clearTimeout(toast.timerId);
    clearInterval(toast.progressTimerId);
    toast.state = 'leave';
  }

  onAnimDone(event: any, toast: ActiveToast): void {
    if (event.toState === 'leave') {
      this.toasts = this.toasts.filter(t => t.id !== toast.id);
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error':   return 'error';
      case 'warning': return 'warning';
      case 'info':    return 'info';
      default:        return 'info';
    }
  }
}
