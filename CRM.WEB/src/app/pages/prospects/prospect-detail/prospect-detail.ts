import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProspectService } from '../../../core/services/prospect.service';
import { Prospect } from '../../../core/models/prospect.model';

@Component({
  selector: 'app-prospect-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './prospect-detail.html',
  styleUrl: './prospect-detail.css',
})
export class ProspectDetail implements OnInit {
  prospect = signal<Prospect | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');
  showDeleteConfirm = signal(false);

  constructor(
    private prospectService: ProspectService,
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
        this.router.navigate(['/prospects']);
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
