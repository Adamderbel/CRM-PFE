import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Notifications } from './core/components/notifications/notifications';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Notifications],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
