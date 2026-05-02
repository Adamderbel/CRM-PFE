import { Component, OnInit, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { ClientCermService } from '../../../core/services/client-cerm.service';
import { ProduitCermService } from '../../../core/services/produit-cerm.service';
import { ReclamationCreateDto } from '../../../core/models/reclamation.model';
import { ClientCerm } from '../../../core/models/client-cerm.model';
import { ProduitCerm } from '../../../core/models/produit-cerm.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reclamation-form',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './reclamation-form.html',
  styleUrl: './reclamation-form.css'
})
export class ReclamationForm implements OnInit {
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  titre = signal('');
  description = signal('');
  statut = signal('Nouveau');
  priorite = signal('Normale');
  source = signal('Email');
  numeroReference = signal('');
  clientId = signal<number | null>(null);
  produitId = signal<number | null>(null);
  responsableId = signal<number | null>(null);

  // Search signals (Autocomplete)
  clientSearchQuery = signal('');
  productSearchQuery = signal('');

  selectedClient = signal<ClientCerm | null>(null);
  selectedProduct = signal<ProduitCerm | null>(null);

  foundClients = signal<ClientCerm[]>([]);
  foundProducts = signal<ProduitCerm[]>([]);

  isSearchingClient = signal(false);
  isSearchingProduct = signal(false);

  constructor(
    private reclamationService: ReclamationService,
    private clientService: ClientCermService,
    private produitService: ProduitCermService,
    private router: Router
  ) {
    // Suggest clients as user types (Only by Name)
    effect(() => {
      const query = this.clientSearchQuery();
      if (query.length >= 2 && (!this.selectedClient() || query !== this.selectedClient()?.nom)) {
        this.searchClients(query);
      } else if (query.length < 2) {
        this.foundClients.set([]);
      }
    }, { allowSignalWrites: true });

    // Suggest products as user types (Only by Designation)
    effect(() => {
      const query = this.productSearchQuery();
      if (query.length >= 2 && (!this.selectedProduct() || query !== this.selectedProduct()?.designation)) {
        this.searchProducts(query);
      } else if (query.length < 2) {
        this.foundProducts.set([]);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
  }

  searchClients(query: string): void {
    this.isSearchingClient.set(true);
    // Search only by name (nom)
    this.clientService.recherche({ nom: query, limit: 10 }).subscribe({
      next: (clients) => {
        this.foundClients.set(clients);
        this.isSearchingClient.set(false);
      },
      error: () => this.isSearchingClient.set(false)
    });
  }

  searchProducts(query: string): void {
    this.isSearchingProduct.set(true);
    // Search only by designation
    this.produitService.getAll({ designation: query, limit: 10 }).subscribe({
      next: (products) => {
        this.foundProducts.set(products);
        this.isSearchingProduct.set(false);
      },
      error: () => this.isSearchingProduct.set(false)
    });
  }

  selectClient(client: ClientCerm): void {
    this.selectedClient.set(client);
    this.clientId.set(client.refClient);
    this.clientSearchQuery.set(client.nom || ''); // Show NAME in input
    this.foundClients.set([]);
  }

  selectProduct(product: ProduitCerm): void {
    this.selectedProduct.set(product);
    this.produitId.set(product.refProduit);
    this.productSearchQuery.set(product.designation || ''); // Show DESIGNATION in input
    this.foundProducts.set([]);
  }

  clearClient(): void {
    this.selectedClient.set(null);
    this.clientId.set(null);
    this.clientSearchQuery.set('');
    this.foundClients.set([]);
  }

  clearProduct(): void {
    this.selectedProduct.set(null);
    this.produitId.set(null);
    this.productSearchQuery.set('');
    this.foundProducts.set([]);
  }

  save(): void {
    this.errorMessage.set('');

    if (!this.titre() || !this.clientId() || !this.produitId()) {
      this.errorMessage.set('Veuillez remplir les champs obligatoires (*).');
      return;
    }

    if (this.titre().length > 200) {
      this.errorMessage.set('Le titre ne peut pas dépasser 200 caractères.');
      return;
    }

    this.isSaving.set(true);

    const payload: ReclamationCreateDto = {
      titre: this.titre(),
      description: this.description(),
      statut: this.statut(),
      priorite: this.priorite(),
      source: this.source(),
      numeroReference: this.numeroReference(),
      clientId: this.clientId()!,
      produitId: this.produitId()!,
      responsableId: this.responsableId() || undefined
    };

    this.reclamationService.create(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set('Réclamation créée avec succès.');
        setTimeout(() => this.router.navigate(['/reclamations']), 1500);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err?.error?.error || 'Erreur lors de la création de la réclamation.');
      }
    });
  }
}
