import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { LigneProspectionService } from '../../../core/services/ligne-prospection.service';
import { LigneProspectionCreateDto, LigneProspectionUpdateDto } from '../../../core/models/ligne-prospection.model';

@Component({
  selector: 'app-ligne-prospection-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ligne-prospection-form.html',
  styleUrl: './ligne-prospection-form.css'
})
export class LigneProspectionForm implements OnInit {
  isEditMode = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ligneId = signal<string | null>(null);
  prospectionId = signal<string | null>(null);

  // Form fields
  designation = signal('');
  date = signal<string>('');
  familleProduitId = signal<number | ''>('');
  supportProduitId = signal<number | ''>('');
  societeeId = signal<number | ''>('');
  statutId = signal<number | ''>('');

  // Lists for selects
  familleProduits = signal<any[]>([]);
  societes = signal<any[]>([]);
  statuts = signal<any[]>([]);
  supportProduits = signal<any[]>([]);

  constructor(
    private ligneService: LigneProspectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();

    // Check url params
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode.set(true);
        this.ligneId.set(id);
        this.loadLigne(id);
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['prospectionId']) {
        this.prospectionId.set(params['prospectionId']);
      }
    });

    // Set default date to today
    if (!this.isEditMode()) {
      const today = new Date();
      this.date.set(today.toISOString().split('T')[0] + 'T00:00');
    }
  }

  loadDropdowns() {
    this.ligneService.getFamilleProduits().subscribe(data => this.familleProduits.set(data));
    this.ligneService.getSocietes().subscribe(data => this.societes.set(data));
    this.ligneService.getStatuts().subscribe(data => this.statuts.set(data));
    this.ligneService.getSupportProduits().subscribe(data => this.supportProduits.set(data));
  }

  loadLigne(id: string) {
    this.isLoading.set(true);
    this.ligneService.getById(id).subscribe({
      next: (ligne) => {
        this.designation.set(ligne.designation || '');
        this.prospectionId.set(ligne.prospectionId);
        this.familleProduitId.set(ligne.familleProduitId);
        this.supportProduitId.set(ligne.supportProduitId || '');
        this.societeeId.set(ligne.societeeId || '');
        this.statutId.set(ligne.statutId || '');

        if (ligne.date) {
            const d = new Date(ligne.date);
            this.date.set(new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16));
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement des données.');
        this.isLoading.set(false);
      }
    });
  }

  save() {
    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.prospectionId() || !this.familleProduitId()) {
      this.errorMessage.set('Veuillez remplir tous les champs obligatoires.');
      this.isSaving.set(false);
      return;
    }

    if (this.isEditMode() && this.ligneId()) {
      const dto: LigneProspectionUpdateDto = {
        designation: this.designation(),
        prospectionId: this.prospectionId()!,
        familleProduitId: Number(this.familleProduitId()),
        supportProduitId: this.supportProduitId() ? Number(this.supportProduitId()) : undefined,
        societeeId: this.societeeId() ? Number(this.societeeId()) : undefined,
        statutId: this.statutId() ? Number(this.statutId()) : undefined,
        date: this.date()
      };

      this.ligneService.update(this.ligneId()!, dto).subscribe({
        next: () => {
          this.successMessage.set('Ligne mise à jour avec succès.');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/ligne-prospections', this.prospectionId()]), 1500);
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Erreur lors de la mise à jour.');
          this.isSaving.set(false);
        }
      });
    } else {
      const dto: LigneProspectionCreateDto = {
        designation: this.designation(),
        prospectionId: this.prospectionId()!,
        familleProduitId: Number(this.familleProduitId()),
        supportProduitId: this.supportProduitId() ? Number(this.supportProduitId()) : undefined,
        societeeId: this.societeeId() ? Number(this.societeeId()) : undefined,
        statutId: this.statutId() ? Number(this.statutId()) : undefined,
        date: this.date()
      };

      this.ligneService.create(dto).subscribe({
        next: () => {
          this.successMessage.set('Ligne créée avec succès.');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/ligne-prospections', this.prospectionId()]), 1500);
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Erreur lors de la création.');
          this.isSaving.set(false);
        }
      });
    }
  }
}
