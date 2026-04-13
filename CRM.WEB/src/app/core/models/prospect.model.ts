export interface Prospect {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  source: string;
  dateCreation: string;
  notes: string;
  idDomaineActivitee: number;
  domaineActivite?: DomaineActivite;
}

export interface CreateProspectRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  source: string;
  dateCreation?: string;
  notes: string;
  idDomaineActivitee: number;
}

export interface UpdateProspectRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  source: string;
  notes: string;
  idDomaineActivitee: number;
}

export interface DomaineActivite {
  id: number;
  activitee: string;
}
