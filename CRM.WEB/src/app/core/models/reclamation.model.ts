export interface Reclamation {
  id: string;

  titre?: string;
  description?: string;

  statut?: string;
  priorite?: string;

  source?: string;

  numeroReference?: string;

  clientId: number;
  nomClient?: string;

  produitId: number;
  designationProduit?: string;

  responsableId?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface ReclamationCreateDto {
  titre: string;
  description: string;
  statut: string;
  priorite: string;
  source?: string;
  numeroReference: string;
  clientId: number;
  produitId: number;
  responsableId?: string;
}

export interface ReclamationUpdateDto {
  titre?: string;
  description?: string;
  statut?: string;
  priorite?: string;
  source?: string;
  numeroReference?: string;
  clientId?: number;
  produitId?: number;
  responsableId?: string;
}
