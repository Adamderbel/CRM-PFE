export interface ActionsProspection {
  id?: string;
  typeActionId: number;
  prospectionId: string;
  ligneProspectionId?: string | null;
  dateAction: string;
  commentaire?: string | null;
  resultat?: string | null;
  typeAction?: { id: number; libelle?: string };
}

export interface TypeActionProspection {
  id: number;
  libelle?: string;
}
