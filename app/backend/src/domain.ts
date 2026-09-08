// Central place for the string-based "enums" used across the schema
// (SQLite has no native enum type — see prisma/schema.prisma).

// PROFESSIONNEL and DISPATCHER are accepted at registration (the storyboard's
// "Quel type de compte" step) even though their dedicated dashboards are
// later phases — the role exists on the account from day one so nothing
// needs re-registering once those modules land.
export const ROLES = ["PARTICULIER", "PROFESSIONNEL", "TRANSPORTEUR", "DISPATCHER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const MISSION_STATUSES = [
  "PUBLISHED",
  "ATTRIBUTED",
  "CONFIRMED",
  "CANCELLED",
] as const;
export type MissionStatus = (typeof MISSION_STATUSES)[number];

export const OFFER_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
] as const;
export type OfferStatus = (typeof OFFER_STATUSES)[number];

export const ORGANIZATION_ACTIVITIES = [
  "MARCHANDISES",
  "VOYAGEURS",
  "COMMISSIONNAIRE",
  "LOGISTIQUE",
  "MARITIME",
  "AERIEN",
  "FERROVIAIRE",
  "AUTRE",
] as const;
export type OrganizationActivity = (typeof ORGANIZATION_ACTIVITIES)[number];

export const CAPACITY_STATUSES = ["PUBLISHED", "PAUSED", "ARCHIVED"] as const;
export type CapacityStatus = (typeof CAPACITY_STATUSES)[number];

export const CONTRACT_TYPES = [
  "TRANSPORT",
  "SOUS_TRAITANCE",
  "COMMISSIONNEMENT",
  "MISE_A_DISPOSITION",
] as const;
export type ContractType = (typeof CONTRACT_TYPES)[number];

export const CONTRACT_STATUSES = [
  "DRAFT",
  "SENT",
  "PARTIALLY_SIGNED",
  "FULLY_SIGNED",
  "CANCELLED",
] as const;
export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

export const DOSSIER_TYPES = ["MISSION", "CONTRACT", "ORGANIZATION"] as const;
export type DossierType = (typeof DOSSIER_TYPES)[number];

export const DOCUMENT_TYPES = [
  "FACTURE",
  "BON_LIVRAISON",
  "POD",
  "CONTRAT",
  "ASSURANCE",
  "DOUANE",
  "AUTRE",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const MAX_DOCUMENT_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
