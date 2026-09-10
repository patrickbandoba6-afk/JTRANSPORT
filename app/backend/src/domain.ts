// Central place for the string-based "enums" used across the schema
// (SQLite has no native enum type — see prisma/schema.prisma).

// PROFESSIONNEL and DISPATCHER are accepted at registration (the storyboard's
// "Quel type de compte" step) even though their dedicated dashboards are
// later phases — the role exists on the account from day one so nothing
// needs re-registering once those modules land.
export const ROLES = [
  "PARTICULIER",
  "PROFESSIONNEL",
  "TRANSPORTEUR",
  "DISPATCHER",
  "CHAUFFEUR",
  "ADMIN",
] as const;
export type Role = (typeof ROLES)[number];

// Only three account types exist at signup: a person, a company, or a
// carrier. "Dispatcher", "responsable logistique", "opérateur" and
// "chauffeur" are NOT account types — they are roles held inside an
// organization (see OrganizationMember), so a dispatcher can never spin up
// an independent company and break the chain of custody.
// ADMIN is granted out-of-band (seed / future invite flow), never picked
// from a public form. DISPATCHER and CHAUFFEUR remain in ROLES only so
// accounts created before this change stay readable.
export const SELF_REGISTERABLE_ROLES = ["PARTICULIER", "PROFESSIONNEL", "TRANSPORTEUR"] as const;

export const ORGANIZATION_MEMBER_ROLES = [
  "ADMINISTRATEUR",
  "RESPONSABLE_LOGISTIQUE",
  "DISPATCHER",
  "OPERATEUR",
  "CHAUFFEUR",
] as const;
export type OrganizationMemberRole = (typeof ORGANIZATION_MEMBER_ROLES)[number];

// A parcel's own lifecycle. Statuses only ever move forward through
// recorded events — see ParcelEvent, which is append-only.
export const PARCEL_STATUSES = [
  "CREATED",
  "READY_TO_DISPATCH",
  "ASSIGNED",
  "PICKED_UP",
  "IN_DELIVERY",
  "DELIVERED",
  "RETURNED",
  "INCIDENT",
  "CLOSED",
] as const;
export type ParcelStatus = (typeof PARCEL_STATUSES)[number];

export const PARCEL_EVENT_TYPES = [
  "CREATED",
  "LABELLED",
  "READY_TO_DISPATCH",
  "ASSIGNED_TO_CARRIER",
  "PICKED_UP",
  "DELIVERY_ATTEMPT",
  "DELIVERED",
  "RETURNED",
  "INCIDENT_OPENED",
  "INCIDENT_UPDATED",
  "INCIDENT_RESOLVED",
  "CORRECTION",
] as const;
export type ParcelEventType = (typeof PARCEL_EVENT_TYPES)[number];

// Deliberately graduated: nothing is ever auto-labelled a theft. A parcel
// that can't be accounted for opens as NON_LOCALISE and can only reach
// VOL_CONFIRME after a human investigation closes it that way.
export const INCIDENT_STATUSES = [
  "SIGNALE",
  "NON_LOCALISE",
  "PERTE_SUSPECTEE",
  "DOMMAGE_CONSTATE",
  "LIVRAISON_CONTESTEE",
  "EN_INVESTIGATION",
  "RESOLU",
  "VOL_CONFIRME",
] as const;
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export const CUSTODIAN_TYPES = ["ORGANIZATION", "CARRIER", "DRIVER", "RECIPIENT"] as const;
export type CustodianType = (typeof CUSTODIAN_TYPES)[number];

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

export const TRANSPORT_MODES = ["ROUTIER", "MARITIME", "AERIEN", "FERROVIAIRE", "MULTIMODAL"] as const;
export type TransportMode = (typeof TRANSPORT_MODES)[number];

export const CARGO_TYPES = ["COLIS", "MARCHANDISE", "VEHICULE", "CONTENEUR"] as const;
export type CargoType = (typeof CARGO_TYPES)[number];

export const CUSTOMS_FEES_STATUSES = ["NONE", "ESTIMATED", "OFFICIAL", "PAID"] as const;
export type CustomsFeesStatus = (typeof CUSTOMS_FEES_STATUSES)[number];

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
