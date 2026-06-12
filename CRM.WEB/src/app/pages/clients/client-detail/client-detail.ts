import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientCerm } from '../../../core/models/client-cerm.model';
import { Prospection } from '../../../core/models/prospection.model';
import { ClientCermService } from '../../../core/services/client-cerm.service';
import { ProspectionService } from '../../../core/services/prospection.service';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.css',
})
export class ClientDetail implements OnInit {
  client = signal<ClientCerm | null>(null);
  prospections = signal<Prospection[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  deletingProspectionId = signal<string | null>(null);

  constructor(
    private clientCermService: ClientCermService,
    private prospectionService: ProspectionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage.set('Identifiant client invalide.');
      this.isLoading.set(false);
      return;
    }

    this.loadClient(id);
  }

  loadClient(id: number): void {
    this.isLoading.set(true);
    this.clientCermService.getById(id).subscribe({
      next: (client) => {
        this.client.set(client);
        this.prospectionService.getByClientId(id).subscribe({
          next: (prospections) => {
            this.prospections.set(prospections ?? []);
            this.isLoading.set(false);
          },
          error: () => {
            this.prospections.set([]);
            this.errorMessage.set('Impossible de charger les prospections du client.');
            this.isLoading.set(false);
          },
        });
      },
      error: () => {
        this.errorMessage.set('Impossible de charger le client.');
        this.isLoading.set(false);
      },
    });
  }

  deleteProspection(prospection: Prospection): void {
    if (!confirm('Supprimer cette prospection et toutes ses actions et lignes ?')) return;

    this.deletingProspectionId.set(prospection.id);
    this.prospectionService.delete(prospection.id).subscribe({
      next: () => {
        this.prospections.update((items) => items.filter((item) => item.id !== prospection.id));
        this.deletingProspectionId.set(null);
      },
      error: () => {
        this.deletingProspectionId.set(null);
        this.errorMessage.set('Impossible de supprimer cette prospection.');
      },
    });
  }

  backToClients(): void {
    this.router.navigate(['/clients']);
  }
}
