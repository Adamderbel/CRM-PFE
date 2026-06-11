export interface Prospect {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  source?: string;
  dateCreation: string;
  notes: string;
  idDomaineActivite: number;
  clientCermId?: number;
  codeCRM?: string;
  domaineActivite?: DomaineActivite;
  clientCerm?: { id: number; nom: string };
}

export interface CreateProspectRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  source?: string;
  dateCreation?: string;
  notes: string;
  idDomaineActivite: number;
  clientCermId?: number;
  codeCRM?: string;
}

export interface UpdateProspectRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  source?: string;
  notes: string;
  idDomaineActivite: number;
  clientCermId?: number;
  codeCRM?: string;
}

export interface DomaineActivite {
  id: number;
  activitee: string;
}
