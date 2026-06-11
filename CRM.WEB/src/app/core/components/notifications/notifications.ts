import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  constructor(public notificationService: NotificationService) {}

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}