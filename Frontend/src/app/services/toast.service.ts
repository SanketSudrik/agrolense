import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  type: ToastType;
  message: string;
  title?: string;
  duration?: number; // ms, default 4000
}

/**
 * Lightweight toast notification service.
 *
 * Usage:
 *   this.toast.success('Saved successfully!');
 *   this.toast.error('Something went wrong', 'Error');
 *   this.toast.warning('Connection slow');
 *   this.toast.info('Tip: you can drag to reorder');
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<ToastData>();

  /** Observable stream of incoming toasts – consumed by ToastComponent */
  get toast$(): Observable<ToastData> {
    return this.toastSubject.asObservable();
  }

  /** Show a success toast */
  success(message: string, title?: string, duration?: number): void {
    this.show({ type: 'success', message, title: title ?? 'Success', duration });
  }

  /** Show an error toast */
  error(message: string, title?: string, duration?: number): void {
    this.show({ type: 'error', message, title: title ?? 'Error', duration: duration ?? 5000 });
  }

  /** Show a warning toast */
  warning(message: string, title?: string, duration?: number): void {
    this.show({ type: 'warning', message, title: title ?? 'Warning', duration });
  }

  /** Show an info toast */
  info(message: string, title?: string, duration?: number): void {
    this.show({ type: 'info', message, title: title ?? 'Info', duration });
  }

  /** Generic show method */
  show(data: ToastData): void {
    this.toastSubject.next(data);
  }
}
