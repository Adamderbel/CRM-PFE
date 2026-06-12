import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LigneProspectionService } from '../../../core/services/ligne-prospection.service';
import { LigneProspectionCreateDto, LigneProspectionUpdateDto } from '../../../core/models/ligne-prospection.model';

@Component({
  selector: 'app-ligne-prospection-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  dateDemandeOffre = signal<string>('');
  numeroDevis = signal('');
  dateDevis = signal<string>('');
  numeroCommande = signal('');
  dateCommande = signal<string>('');
  batEnvoyee = signal<boolean>(false);
  dateEnvoiBat = signal<string>('');
  concretisee = signal<boolean>(false);
  causeEchecId = signal<number | null>(null);
  societeId = signal<number | null>(null);
  statutId = signal<number | null>(null);
  familleProduitId = signal<number | ''>('');
  supportProduitId = signal<number | null>(null);

  // Lists for selects
  familleProduits = signal<any[]>([]);
  societes = signal<any[]>([]);
  statuts = signal<any[]>([]);
  supportProduits = signal<any[]>([]);
  causeEchecs = signal<any[]>([]);
  produitsCerm = signal<any[]>([]);

  constructor(
    public ligneService: LigneProspectionService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();

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

    if (!this.isEditMode()) {
      queueMicrotask(() => {
        if (!this.isEditMode()) {
          const today = new Date();
          this.date.set(today.toISOString().split('T')[0] + 'T00:00');
        }
      });
    }
  }

  loadDropdowns() {
    this.ligneService.getFamilleProduits().subscribe(data => this.familleProduits.set(data));
    this.ligneService.getSocietes().subscribe(data => this.societes.set(data));
    this.ligneService.getStatuts().subscribe(data => this.statuts.set(data));
    this.ligneService.getSupportProduits().subscribe(data => this.supportProduits.set(data));
    this.ligneService.getCauseEchecs().subscribe(data => this.causeEchecs.set(data));
    this.ligneService.getProduitsCerm().subscribe(data => this.produitsCerm.set(data));
  }

  loadLigne(id: string) {
    this.isLoading.set(true);
    this.ligneService.getById(id).subscribe({
      next: (ligne) => {
        queueMicrotask(() => {
          this.designation.set(ligne.designation || '');
          this.prospectionId.set(ligne.prospectionId);
          this.familleProduitId.set(ligne.familleProduitId);
          this.supportProduitId.set(ligne.supportProduitId ?? null);
          this.societeId.set(ligne.societeId ?? ligne.societeeId ?? null);
          this.statutId.set(ligne.statutId ?? null);
          this.dateDemandeOffre.set(ligne.dateDemandeOffre ? new Date(ligne.dateDemandeOffre).toISOString().slice(0, 10) : '');
          this.numeroDevis.set(ligne.numeroDevis || '');
          this.dateDevis.set(ligne.dateDevis ? new Date(ligne.dateDevis).toISOString().slice(0, 10) : '');
          this.numeroCommande.set(ligne.numeroCommande || '');
          this.dateCommande.set(ligne.dateCommande ? new Date(ligne.dateCommande).toISOString().slice(0, 10) : '');
          this.batEnvoyee.set(ligne.batEnvoyee || false);
          this.dateEnvoiBat.set(ligne.dateEnvoiBat ? new Date(ligne.dateEnvoiBat).toISOString().slice(0, 10) : '');
          this.concretisee.set(ligne.concretisee || false);
          this.causeEchecId.set(ligne.causeEchecId || null);
          if (ligne.date) {
            const d = new Date(ligne.date);
            this.date.set(new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16));
          }
          this.isLoading.set(false);
        });
      },
      error: () => {
        queueMicrotask(() => {
          this.errorMessage.set('Erreur lors du chargement des données.');
          this.isLoading.set(false);
        });
      }
    });
  }

  save() {
    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.prospectionId() || !this.familleProduitId()) {
      this.errorMessage.set('Veuillez remplir les champs obligatoires.');
      this.isSaving.set(false);
      return;
    }

    const createDto: LigneProspectionCreateDto = {
      designation: this.designation(),
      prospectionId: this.prospectionId()!,
      familleProduitId: Number(this.familleProduitId()),
      supportProduitId: this.supportProduitId() ? Number(this.supportProduitId()) : undefined,
      societeId: this.societeId() ? Number(this.societeId()) : undefined,
      statutId: this.statutId() ? Number(this.statutId()) : undefined,
      date: this.date(),
    };

    if (this.isEditMode() && this.ligneId()) {
      const dto: LigneProspectionUpdateDto = {
        ...createDto,
        dateDemandeOffre: this.dateDemandeOffre() || undefined,
        numeroDevis: this.numeroDevis() || undefined,
        dateDevis: this.dateDevis() || undefined,
        numeroCommande: this.numeroCommande() || undefined,
        dateCommande: this.dateCommande() || undefined,
        batEnvoyee: this.batEnvoyee(),
        dateEnvoiBat: this.dateEnvoiBat() || undefined,
        concretisee: this.concretisee(),
        causeEchecId: this.causeEchecId() || undefined,
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
      this.ligneService.create(createDto).subscribe({
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
