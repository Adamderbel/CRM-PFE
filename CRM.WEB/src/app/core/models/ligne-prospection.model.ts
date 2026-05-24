export interface LigneProspection {
  id: string;
  designation?: string;
  familleProduitId: number;
  supportProduitId?: number;
  prospectionId: string;
  societeeId?: number;
  statutId?: number;
  date: string | Date;

  dateDemandeOffre?: string | Date;
  numeroDevis?: string;
  dateDevis?: string | Date;
  numeroCommande?: string;
  dateCommande?: string | Date;

  concretisee?: boolean;
  causeEchecId?: number;

  // Navigation properties (optional representation of related backend data)
  statut?: any;
  prospection?: any;
  familleProduit?: any;
  supportProduit?: any;
  societee?: any;
  causeEchec?: any;
}

export interface LigneProspectionCreateDto {
  designation?: string;
  familleProduitId: number;
  supportProduitId?: number;
  prospectionId: string;
  societeeId?: number;
  statutId?: number;
  date: string | Date;
}

export interface LigneProspectionUpdateDto {
  designation?: string;
  familleProduitId: number;
  supportProduitId?: number;
  prospectionId: string;
  societeeId?: number;
  statutId?: number;
  date: string | Date;
}
