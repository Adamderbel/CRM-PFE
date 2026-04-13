export interface LigneProspection {
  id: string;
  designation?: string;
  familleProduitId: number;
  supportProduitId?: number;
  prospectionId: string;
  societeeId?: number;
  statutId?: number;
  date: string | Date;

  // Navigation properties (optional representation of related backend data)
  statut?: any;
  prospection?: any;
  familleProduit?: any;
  supportProduit?: any;
  societee?: any;
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
