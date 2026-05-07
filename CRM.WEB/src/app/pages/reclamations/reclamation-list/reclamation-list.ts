import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { Reclamation } from '../../../core/models/reclamation.model';

@Component({
  selector: 'app-reclamation-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './reclamation-list.html',
  styleUrl: './reclamation-list.css'
})
export class ReclamationList implements OnInit {
  reclamations = signal<Reclamation[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private reclamationService: ReclamationService) { }

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.isLoading.set(true);
    this.reclamationService.getAll().subscribe({
      next: (data) => {
        this.reclamations.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement des réclamations.');
        this.isLoading.set(false);
      }
    });
  }
}
