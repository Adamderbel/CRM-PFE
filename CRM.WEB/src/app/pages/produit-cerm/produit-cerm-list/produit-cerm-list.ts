import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduitCermService } from '../../../core/services/produit-cerm.service';
import { ProduitCerm } from '../../../core/models/produit-cerm.model';

@Component({
  selector: 'app-produit-cerm-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produit-cerm-list.html',
  styleUrl: './produit-cerm-list.css',
})
export class ProduitCermList implements OnInit {
  refArtQuery = signal('');
  designationQuery = signal('');
  limit = signal(100);

  constructor(public produitCermService: ProduitCermService) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.produitCermService.getAll({
      refArt: this.refArtQuery(),
      designation: this.designationQuery(),
      limit: this.limit()
    }).subscribe();
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
