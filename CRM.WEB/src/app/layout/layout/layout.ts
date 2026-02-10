import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Sidebar } from "../sidebar/sidebar";


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Navbar, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
