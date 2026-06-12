import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProspectService } from '../../../core/services/prospect.service';
import { ProspectionService } from '../../../core/services/prospection.service';
import { Prospect } from '../../../core/models/prospect.model';
import { Prospection } from '../../../core/models/prospection.model';

@Component({
  selector: 'app-prospect-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './prospect-detail.html',
  styleUrl: './prospect-detail.css',
})
export class ProspectDetail implements OnInit {
  prospect = signal<Prospect | null>(null);
  prospections = signal<Prospection[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  showDeleteConfirm = signal(false);
  deletingProspectionId = signal<string | null>(null);

  constructor(
    private prospectService: ProspectService,
    private prospectionService: ProspectionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProspect(id);
    }
  }

  loadProspect(id: string): void {
    this.isLoading.set(true);
    this.prospectService.getById(id).subscribe({
      next: (data) => {
        this.prospect.set(data);
        this.isLoading.set(false);
        this.prospectionService.getByProspectId(id).subscribe({
          next: (list) => this.prospections.set(list ?? []),
          error: () => this.prospections.set([]),
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger le prospect.');
      },
    });
  }

  editProspect(): void {
    const p = this.prospect();
    if (p) {
      this.router.navigate(['/prospects', 'edit', p.id]);
    }
  }

  confirmDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  deleteProspect(): void {
    const p = this.prospect();
    if (!p) return;

    this.prospectService.delete(p.id).subscribe({
      next: () => {
        this.showDeleteConfirm.set(false);
        this.router.navigate(['/prospects']);
      },
    });
  }

  deleteProspection(prospection: Prospection): void {
    if (!confirm('Supprimer cette prospection et toutes ses actions et lignes ?')) {
      return;
    }

    this.deletingProspectionId.set(prospection.id);
    this.errorMessage.set('');
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

  formatDate(date: string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
}
