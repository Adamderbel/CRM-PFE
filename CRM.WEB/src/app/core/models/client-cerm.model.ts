export interface ClientCerm {
  id: number;
  refClient?: number;
  nom: string | null;
  lastModifiedDate?: string | null;
  lastSyncDate?: string | null;
  codeCRM?: string | null;
}
