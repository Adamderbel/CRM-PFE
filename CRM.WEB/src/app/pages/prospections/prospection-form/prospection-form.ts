import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProspectionService } from '../../../core/services/prospection.service';
import { ProspectService } from '../../../core/services/prospect.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProspectionCreateDto, ProspectionUpdateDto } from '../../../core/models/prospection.model';

@Component({
  selector: 'app-prospection-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './prospection-form.html',
  styleUrl: './prospection-form.css',
})
export class ProspectionForm implements OnInit {
  isEditMode = signal(false);
  prospectionId = signal<string | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  prospects = signal<any[]>([]);
  statuts = signal<any[]>([]);

  dateDebut = signal('');
  notes = signal('');
  statutId = signal('');
  prospectId = signal('');
  userId = signal('');
  isProspectFixed = signal(false);

  constructor(
    private prospectionService: ProspectionService,
    private prospectService: ProspectService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProspects();
    this.loadStatuts();

    // Set the initial user to the connected user from local storage
    const connectedUserId = this.authService.user()?.id;
    if (connectedUserId) {
      this.userId.set(connectedUserId);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.prospectionId.set(id);
      this.loadProspection(id);
    } else {
      const qProspectId = this.route.snapshot.queryParamMap.get('prospectId');
      if (qProspectId) {
        this.prospectId.set(qProspectId);
        this.isProspectFixed.set(true);
      }
    }
  }

  loadProspects(): void {
    this.prospectService.getAll().subscribe({
      next: (data) => {
        if (this.isProspectFixed()) {
          this.prospects.set(data.filter(p => p.id === this.prospectId()));
        } else {
          this.prospects.set(data);
        }
      }
    });
  }

  loadStatuts(): void {
    this.prospectionService.getStatuts().subscribe({
      next: (data) => {
        this.statuts.set(data);
        if (!this.isEditMode()) {
          const defaultStatut = data.find(s => {
            const label = (s.libelle || s.nom || '').toLowerCase().replace(/\s+/g, '');
            return label === 'encours' || label === 'en-cours' || label.includes('cours');
          });
          if (defaultStatut) {
            this.statutId.set(defaultStatut.id);
          } else if (data.length > 0) {
            // Fallback just in case spelling differs
            this.statutId.set(data[0].id);
          }
        }
      }
    });
  }

  loadProspection(id: string): void {
    this.isLoading.set(true);
    this.prospectionService.getById(id).subscribe({
      next: (prospection) => {
        if (prospection.dateDebut) {
          const d = new Date(prospection.dateDebut);
          this.dateDebut.set(d.toISOString().slice(0, 16)); // format for datetime-local
        }

        this.notes.set(prospection.notes || '');
        this.statutId.set(prospection.statutId || '');
        this.prospectId.set(prospection.prospectId || '');
        this.userId.set(prospection.userId || '');

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les données de la prospection.');
        this.isLoading.set(false);
      },
    });
  }

  save(): void {
    this.errorMessage.set('');

    if (!this.prospectId() || !this.statutId() || !this.userId()) {
      this.errorMessage.set('Veuillez remplir les champs obligatoires (Prospect, Statut, Utilisateur).');
      return;
    }

    if (!this.dateDebut()) {
      this.errorMessage.set('La date de début est obligatoire.');
      return;
    }

    if (this.notes() && this.notes().length > 500) {
      this.errorMessage.set('Les notes ne peuvent pas dépasser 500 caractères.');
      return;
    }

    this.isSaving.set(true);

    const payload = {
      dateDebut: this.dateDebut() ? new Date(this.dateDebut()).toISOString() : undefined,
      notes: this.notes(),
      statutId: this.statutId(),
      prospectId: this.prospectId() ? this.prospectId() : undefined,
      userId: this.userId() ? this.userId() : undefined,
    };

    if (this.isEditMode() && this.prospectionId()) {
      this.prospectionService.update(this.prospectionId()!, payload as ProspectionUpdateDto).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.successMessage.set('Prospection mise à jour avec succès.');
          setTimeout(() => {
            if (this.prospectId()) {
              this.router.navigate(['/prospections'], { queryParams: { prospectId: this.prospectId() } });
            } else {
              this.router.navigate(['/prospections']);
            }
          }, 1500);
        },
        error: () => {
          this.isSaving.set(false);
          this.errorMessage.set('Erreur lors de la mise à jour.');
        },
      });
    } else {
      this.prospectionService.create(payload as ProspectionCreateDto).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.successMessage.set('Prospection créée avec succès.');
          setTimeout(() => {
            if (this.prospectId()) {
              this.router.navigate(['/prospections'], { queryParams: { prospectId: this.prospectId() } });
            } else {
              this.router.navigate(['/prospections']);
            }
          }, 1500);
        },
        error: () => {
          this.isSaving.set(false);
          this.errorMessage.set('Erreur lors de la création.');
        },
      });
    }
  }
}
