// Central place for the string-based "enums" used across the schema
// (SQLite has no native enum type — see prisma/schema.prisma).

// PROFESSIONNEL and DISPATCHER are accepted at registration (the storyboard's
// "Quel type de compte" step) even though their dedicated dashboards are
// later phases — the role exists on the account from day one so nothing
// needs re-registering once those modules land.
export const ROLES = ["PARTICULIER", "PROFESSIONNEL", "TRANSPORTEUR", "DISPATCHER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

// Self-registration must never allow choosing ADMIN — that role is granted
// out-of-band (seed script, or a future admin-invite flow), never picked
// from a public form.
export const SELF_REGISTERABLE_ROLES = ROLES.filter((r) => r !== "ADMIN") as Exclude<Role, "ADMIN">[];

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

export const DOSSIER_TYPES = ["MISSION", "CONTRACT", "ORGANIZATION", "SHIPMENT"] as const;
export type DossierType = (typeof DOSSIER_TYPES)[number];

export const DOCUMENT_TYPES = [
  "FACTURE",
  "BON_LIVRAISON",
  "POD",
  "CONTRAT",
  "LICENCE",
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

export const SHIPMENT_STATUSES = [
  "CREATED",
  "COLLECTED",
  "AT_WAREHOUSE",
  "GROUPED",
  "IN_CONTAINER",
  "LOADED",
  "DEPARTED",
  "IN_TRANSIT",
  "ARRIVED",
  "CUSTOMS",
  "CUSTOMS_CLEARED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "INCIDENT",
  "CANCELLED",
] as const;
export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const CONTAINER_TYPES = ["FCL_20", "FCL_40", "FCL_40HC", "LCL"] as const;
export type ContainerType = (typeof CONTAINER_TYPES)[number];

export const CONTAINER_STATUSES = [
  "PREPARING",
  "LOADED",
  "DEPARTED",
  "IN_TRANSIT",
  "ARRIVED",
  "CUSTOMS",
  "RELEASED",
  "DELIVERED",
] as const;
export type ContainerStatus = (typeof CONTAINER_STATUSES)[number];

export const CUSTOMS_STATUSES = [
  "DOCUMENTS_PENDING",
  "SUBMITTED",
  "UNDER_REVIEW",
  "CLEARED",
  "BLOCKED",
] as const;
export type CustomsStatus = (typeof CUSTOMS_STATUSES)[number];

export const INVOICE_STATUSES = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
