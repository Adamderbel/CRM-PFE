export interface ActionProspection {
  id?: string;
  prospectionId: string;
  ligneProspectionId?: string;
  typeActionId: number;
  dateAction?: string;
  commentaire?: string;
  resultat?: string;
  typeAction?: { id: number; libelle: string };
}

export interface ActionProspectionCreateDto {
  prospectionId: string;
  ligneProspectionId: string;
  typeActionId: number;
  dateAction: string;
  commentaire?: string;
  resultat?: string;
}
