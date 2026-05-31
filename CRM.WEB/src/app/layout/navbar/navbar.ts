import { Component, OnInit, OnDestroy, computed, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../core/models/notification.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private pollSub?: Subscription;

  userName = computed(() => this.authService.userFullName() || 'Utilisateur');

  notifications = signal<Notification[]>([]);
  dropdownOpen = signal(false);

  unreadCount = computed(() => this.notifications().filter(n => !n.lu).length);

  ngOnInit(): void {
    this.loadNotifications();
    // Poll every 30s
    this.pollSub = interval(30000).subscribe(() => this.loadNotifications());
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  loadNotifications(): void {
    const user = this.authService.user();
    if (!user) return;
    this.notificationService.getByUser(user.id).subscribe({
      next: (data) => this.notifications.set(data ?? []),
      error: () => {},
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(v => !v);
  }

  onNotificationClick(notif: Notification): void {
    if (notif.lu) return;
    this.notificationService.markAsRead(notif.id).subscribe({
      next: () => {
        this.notifications.update(list =>
          list.map(n => (n.id === notif.id ? { ...n, lu: true } : n))
        );
      },
      error: () => {},
    });
  }

  markAllAsRead(): void {
    const unread = this.notifications().filter(n => !n.lu);
    unread.forEach(n => {
      this.notificationService.markAsRead(n.id).subscribe({
        next: () => {
          this.notifications.update(list =>
            list.map(x => (x.id === n.id ? { ...x, lu: true } : x))
          );
        },
        error: () => {},
      });
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return "À l'instant";
      if (diffMin < 60) return `il y a ${diffMin} min`;
      const diffH = Math.floor(diffMin / 60);
      if (diffH < 24) return `il y a ${diffH} h`;
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notif-wrapper')) {
      this.dropdownOpen.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
