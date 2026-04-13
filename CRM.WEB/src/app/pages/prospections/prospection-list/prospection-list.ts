import { Component, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProspectionService } from '../../../core/services/prospection.service';
import { Prospection } from '../../../core/models/prospection.model';

@Component({
  selector: 'app-prospection-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './prospection-list.html',
  styleUrl: './prospection-list.css',
})
export class ProspectionList implements OnInit {
  searchQuery = signal('');
  showDeleteConfirm = signal(false);
  prospectionToDelete = signal<Prospection | null>(null);
  successMessage = signal('');
  prospectId = signal<string | null>(null);

  filteredProspections = computed(() => {
    let list = this.prospectionService.prospections();
    const q = this.searchQuery().toLowerCase();

    if (q) {
      list = list.filter(
        (p) =>
          p.prospect?.nom?.toLowerCase().includes(q) ||
          p.prospect?.prenom?.toLowerCase().includes(q) ||
          p.statut?.nom?.toLowerCase().includes(q)
      );
    }

    return list;
  });

  constructor(
    public prospectionService: ProspectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const pId = params['prospectId'];
      if (pId) {
        this.prospectId.set(pId);
        this.loadProspectionsByProspect(pId);
      } else {
        this.prospectId.set(null);
        this.loadProspections();
      }
    });
  }

  loadProspections(): void {
    this.prospectionService.getAll().subscribe();
  }

  loadProspectionsByProspect(prospectId: string): void {
    this.prospectionService.getByProspectId(prospectId).subscribe();
  }

  editProspection(id: string): void {
    this.router.navigate(['/prospections', 'edit', id]);
  }
  viewProspection(id: string): void {
    this.router.navigate(['/prospections/detail', id]);
  }
  viewLignes(id: string): void {
    this.router.navigate(['/ligne-prospections', id]);
  }
  confirmDelete(prospection: Prospection): void {
    this.prospectionToDelete.set(prospection);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.prospectionToDelete.set(null);
  }

  deleteProspection(): void {
    const prospection = this.prospectionToDelete();
    if (!prospection) return;

    this.prospectionService.delete(prospection.id).subscribe({
      next: () => {
        this.showDeleteConfirm.set(false);
        this.prospectionToDelete.set(null);
        this.successMessage.set('Prospection supprimée avec succès.');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
    });
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
