import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProspectionService } from '../../../core/services/prospection.service';
import { Prospection } from '../../../core/models/prospection.model';

@Component({
  selector: 'app-prospection-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './prospection-detail.html',
  styleUrl: './prospection-detail.css',
})
export class ProspectionDetail implements OnInit {
  prospection = signal<Prospection | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private prospectionService: ProspectionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProspection(id);
    } else {
      this.errorMessage.set('Identifiant de prospection manquant.');
      this.isLoading.set(false);
    }
  }

  loadProspection(id: string): void {
    this.isLoading.set(true);
    this.prospectionService.getById(id).subscribe({
      next: (data) => {
        this.prospection.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les détails de la prospection.');
        this.isLoading.set(false);
      }
    });
  }
}
