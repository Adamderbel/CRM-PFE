import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSignal = signal<AppNotification[]>([]);
  private nextId = 1;

  readonly notifications = this.notificationsSignal.asReadonly();

  show(type: NotificationType, title: string, message: string, duration = 4000): void {
    const id = this.nextId++;
    this.notificationsSignal.update((current) => [...current, { id, type, title, message }]);

    if (duration > 0) {
      window.setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, title = 'Succès', duration?: number): void {
    this.show('success', title, message, duration);
  }

  error(message: string, title = 'Erreur', duration?: number): void {
    this.show('error', title, message, duration);
  }

  warning(message: string, title = 'Avertissement', duration?: number): void {
    this.show('warning', title, message, duration);
  }

  info(message: string, title = 'Information', duration?: number): void {
    this.show('info', title, message, duration);
  }

  dismiss(id: number): void {
    this.notificationsSignal.update((current) => current.filter((item) => item.id !== id));
  }

  clear(): void {
    this.notificationsSignal.set([]);
  }
}