export type Role = "PARTICULIER" | "PROFESSIONNEL" | "TRANSPORTEUR" | "DISPATCHER" | "ADMIN";

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: Role;
};

export type Mission = {
  id: string;
  ownerId: string;
  fromCity: string;
  toCity: string;
  date: string;
  cargo: string;
  weightKg: number;
  vehicleType: string;
  budget: number;
  recurring: boolean;
  status: "PUBLISHED" | "ATTRIBUTED" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  _count?: { offers: number };
};

export type MissionOffer = {
  id: string;
  missionId: string;
  providerId: string;
  price: number;
  message: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  createdAt: string;
  provider?: { id: string; name: string; email: string };
};

export type Organization = {
  id: string;
  ownerId: string;
  name: string;
  activity: string;
  country: string;
  hasProfessionalCapacity: boolean;
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
  capacities?: TransportCapacity[];
};

export type TransportCapacity = {
  id: string;
  organizationId: string;
  vehicleType: string;
  weightCapacityKg: number;
  volumeCapacityM3: number | null;
  zone: string;
  availableFrom: string;
  availableTo: string | null;
  pricePerUnit: number | null;
  status: "PUBLISHED" | "PAUSED" | "ARCHIVED";
  organization?: { id: string; name: string; verificationStatus: string };
};

export type Contract = {
  id: string;
  missionId: string;
  organizationId: string | null;
  ownerId: string;
  counterpartyId: string;
  type: string;
  price: number;
  terms: string | null;
  status: "DRAFT" | "SENT" | "PARTIALLY_SIGNED" | "FULLY_SIGNED" | "CANCELLED";
  ownerSignedAt: string | null;
  counterpartySignedAt: string | null;
  createdAt: string;
};

export type OfferWithMission = MissionOffer & { mission: Mission };

// Server Components (no browser) call the API directly with this base URL.
// Client Components should call relative "/api/..." paths so the browser
// sends the auth cookie — see NEXT_PUBLIC_API_URL usage in apiFetch below.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message?: string) {
    super(message ?? code);
    this.status = status;
    this.code = code;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiRequestError(res.status, body.error ?? "UNKNOWN_ERROR", body.message);
  }

  return body as T;
}
