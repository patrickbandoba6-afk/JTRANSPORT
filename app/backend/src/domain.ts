// Central place for the string-based "enums" used across the schema
// (SQLite has no native enum type — see prisma/schema.prisma).

export const ROLES = ["PARTICULIER", "TRANSPORTEUR", "ADMIN"] as const;
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
