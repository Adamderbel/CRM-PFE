import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./layout/navbar/navbar";
import { Layout } from "./layout/layout/layout";
import { Sidebar } from "./layout/sidebar/sidebar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Layout, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CRM.WEB');
}
