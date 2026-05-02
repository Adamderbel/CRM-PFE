import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProspectService } from '../../../core/services/prospect.service';
import { CreateProspectRequest, DomaineActivite, UpdateProspectRequest } from '../../../core/models/prospect.model';

@Component({
  selector: 'app-prospect-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './prospect-form.html',
  styleUrl: './prospect-form.css',
})
export class ProspectForm implements OnInit {
  isEditMode = signal(false);
  prospectId = signal<string | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  domaines = signal<DomaineActivite[]>([]);

  nom = signal('');
  prenom = signal('');
  email = signal('');
  telephone = signal('');
  source = signal('');
  notes = signal('');
  idDomaineActivitee = signal<number>(0);

  constructor(
    private prospectService: ProspectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDomaines();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.prospectId.set(id);
      this.loadProspect(id);
    }
  }

  loadDomaines(): void {
    this.prospectService.getDomainesActivite().subscribe({
      next: (data) => this.domaines.set(data),
    });
  }

  loadProspect(id: string): void {
    this.isLoading.set(true);
    this.prospectService.getById(id).subscribe({
      next: (prospect) => {
        this.nom.set(prospect.nom || '');
        this.prenom.set(prospect.prenom || '');
        this.email.set(prospect.email || '');
        this.telephone.set(prospect.telephone || '');
        this.source.set(prospect.source || '');
        this.notes.set(prospect.notes || '');
        this.idDomaineActivitee.set(prospect.idDomaineActivitee);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger le prospect.');
      },
    });
  }

  onSubmit(): void {
    this.errorMessage.set('');

    // Validations
    if (!this.nom() || !this.prenom() || !this.email() || !this.telephone() || !this.idDomaineActivitee()) {
      this.errorMessage.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (this.nom().length > 100) {
      this.errorMessage.set('Le nom ne peut pas dépasser 100 caractères.');
      return;
    }

    if (this.prenom().length > 100) {
      this.errorMessage.set('Le prénom ne peut pas dépasser 100 caractères.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.errorMessage.set('Format d\'email invalide. Exemple: nom@domaine.com');
      return;
    }
    if (this.email().length > 150) {
      this.errorMessage.set('L\'email ne peut pas dépasser 150 caractères.');
      return;
    }

    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    if (!phoneRegex.test(this.telephone())) {
      this.errorMessage.set('Format de téléphone invalide. Exemple: 22 777 888');
      return;
    }
    if (this.telephone().length > 20) {
      this.errorMessage.set('Le téléphone ne peut pas dépasser 20 caractères.');
      return;
    }

    if (this.notes() && this.notes().length > 500) {
      this.errorMessage.set('Les notes ne peuvent pas dépasser 500 caractères.');
      return;
    }

    this.isSaving.set(true);

    if (this.isEditMode()) {
      const dto: UpdateProspectRequest = {
        nom: this.nom(),
        prenom: this.prenom(),
        email: this.email(),
        telephone: this.telephone(),
        source: this.source(),
        notes: this.notes(),
        idDomaineActivitee: this.idDomaineActivitee(),
      };

      this.prospectService.update(this.prospectId()!, dto).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/prospects']);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err?.error || 'Erreur lors de la mise à jour.');
        },
      });
    } else {
      const request: CreateProspectRequest = {
        nom: this.nom(),
        prenom: this.prenom(),
        email: this.email(),
        telephone: this.telephone(),
        source: this.source(),
        notes: this.notes(),
        idDomaineActivitee: this.idDomaineActivitee(),
      };

      this.prospectService.create(request).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/prospects']);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err?.error || 'Erreur lors de la création.');
        },
      });
    }
  }
}
