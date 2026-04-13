import { Component, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProspectService } from '../../../core/services/prospect.service';
import { Prospect } from '../../../core/models/prospect.model';

@Component({
  selector: 'app-prospect-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './prospect-list.html',
  styleUrl: './prospect-list.css',
})
export class ProspectList implements OnInit {
  searchQuery = signal('');
  sourceFilter = signal('');
  showDeleteConfirm = signal(false);
  prospectToDelete = signal<Prospect | null>(null);
  successMessage = signal('');

  filteredProspects = computed(() => {
    let list = this.prospectService.prospects();
    const q = this.searchQuery().toLowerCase();
    const src = this.sourceFilter();

    if (q) {
      list = list.filter(
        (p) =>
          (p.nom || '').toLowerCase().includes(q) ||
          (p.prenom || '').toLowerCase().includes(q) ||
          (p.email || '').toLowerCase().includes(q) ||
          (p.telephone || '').toString().toLowerCase().includes(q)
      );
    }

    if (src) {
      list = list.filter((p) => p.source === src);
    }

    return list;
  });

  sources = computed(() => {
    const all = this.prospectService.prospects().map((p) => p.source).filter(Boolean);
    return [...new Set(all)];
  });

  constructor(
    public prospectService: ProspectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProspects();
  }

  loadProspects(): void {
    this.prospectService.getAll().subscribe();
  }

  viewProspections(id: string): void {
    this.router.navigate(['/prospections'], { queryParams: { prospectId: id } });
  }

  viewProspect(id: string): void {
    this.router.navigate(['/prospects', id]);
  }

  editProspect(id: string): void {
    this.router.navigate(['/prospects', 'edit', id]);
  }

  confirmDelete(prospect: Prospect): void {
    this.prospectToDelete.set(prospect);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.prospectToDelete.set(null);
  }

  deleteProspect(): void {
    const prospect = this.prospectToDelete();
    if (!prospect) return;

    this.prospectService.delete(prospect.id).subscribe({
      next: () => {
        this.showDeleteConfirm.set(false);
        this.prospectToDelete.set(null);
        this.successMessage.set('Prospect supprimé avec succès.');
        setTimeout(() => this.successMessage.set(''), 3000);
        this.loadProspects();
      },
    });
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
