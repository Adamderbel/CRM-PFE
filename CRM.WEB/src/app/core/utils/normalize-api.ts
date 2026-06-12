/**
 * Harmonise les reponses API quel que soit le casing JSON (camelCase ou PascalCase).
 */

export function asString(v: unknown): string {
  if (v === undefined || v === null) return '';
  return String(v);
}

export function asNumber(v: unknown, fallback = 0): number {
  if (v === undefined || v === null) return fallback;
  const n = Number(v);
  return Number.isNaN(n) ? fallback : n;
}

export function normalizeProspectRow(p: Record<string, unknown> | null | undefined): {
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
  domaineActivite?: { id: number; activitee: string };
} {
  if (!p) {
    return {
      id: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      dateCreation: '',
      notes: '',
      idDomaineActivite: 0,
    };
  }
  const rawCc = p['clientCermId'] ?? p['ClientCermId'];
  let clientCermId: number | undefined;
  if (rawCc !== undefined && rawCc !== null && rawCc !== '') {
    const n = asNumber(rawCc, NaN);
    clientCermId = Number.isNaN(n) ? undefined : n;
  }
  const id = p['id'] ?? p['Id'];
  const domaine = p['domaineActivite'] ?? p['DomaineActivite'];
  // Handle backend property naming: idDomaineActivitee (two e's) is the entity property name
  const domaineId = p['idDomaineActivitee'] ?? p['IdDomaineActivitee'] ?? p['idDomaineActivite'] ?? p['IdDomaineActivite'];

  return {
    id: asString(id),
    nom: asString(p['nom'] ?? p['Nom']),
    prenom: asString(p['prenom'] ?? p['Prenom']),
    email: asString(p['email'] ?? p['Email']),
    telephone: asString(p['telephone'] ?? p['Telephone']),
    source: p['source'] != null || p['Source'] != null ? asString(p['source'] ?? p['Source']) : undefined,
    dateCreation: asString(p['dateCreation'] ?? p['DateCreation']),
    notes: asString(p['notes'] ?? p['Notes']),
    idDomaineActivite: asNumber(domaineId, 0),
    clientCermId,
    codeCRM: p['codeCRM'] != null || p['CodeCRM'] != null ? asString(p['codeCRM'] ?? p['CodeCRM']) : undefined,
    domaineActivite: domaine ? normalizeDomaineRow(domaine as Record<string, unknown>) : undefined
  };
}

export function normalizeDomaineRow(d: Record<string, unknown> | null | undefined): { id: number; activitee: string } {
  if (!d) return { id: 0, activitee: '' };
  return {
    id: asNumber(d['id'] ?? d['Id'], 0),
    activitee: asString(d['activitee'] ?? d['Activitee']),
  };
}

export function normalizeModeContactRow(m: Record<string, unknown> | null | undefined): { id: number; libelle?: string } {
  if (!m) return { id: 0 };
  return {
    id: asNumber(m['id'] ?? m['Id'], 0),
    libelle: m['libelle'] != null || m['Libelle'] != null ? asString(m['libelle'] ?? m['Libelle']) : undefined,
  };
}

export function normalizeStatutRow(s: Record<string, unknown> | null | undefined): { id: number; libelle: string } {
  if (!s) return { id: 0, libelle: '' };
  return {
    id: asNumber(s['id'] ?? s['Id'], 0),
    libelle: asString(s['libelle'] ?? s['Libelle']),
  };
}
