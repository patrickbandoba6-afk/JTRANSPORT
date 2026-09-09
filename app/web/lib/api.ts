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

export type Parcel = {
  id: string;
  shipmentId: string;
  description: string;
  weightKg: number;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  declaredValue: number | null;
};

export type ShipmentContainer = {
  id: string;
  containerNumber: string;
  type: string;
  sealNumber: string | null;
  originPort: string;
  destinationPort: string;
  shippingLine: string | null;
  vesselName: string | null;
  etd: string | null;
  eta: string | null;
  status: string;
};

export type TrackingEvent = {
  id: string;
  shipmentId: string;
  type: string;
  location: string | null;
  note: string | null;
  createdAt: string;
};

export type CustomsCase = {
  id: string;
  shipmentId: string;
  status: "DOCUMENTS_PENDING" | "SUBMITTED" | "UNDER_REVIEW" | "CLEARED" | "BLOCKED";
  declaredValue: number | null;
  hsCode: string | null;
  incoterm: string | null;
  estimatedFees: number | null;
};

export type Shipment = {
  id: string;
  ownerId: string;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  recipientName: string;
  recipientPhone: string | null;
  recipientEmail: string | null;
  recipientAddress: string;
  status: string;
  containerId: string | null;
  createdAt: string;
  parcels?: Parcel[];
  container?: ShipmentContainer | null;
  customsCase?: CustomsCase | null;
  events?: TrackingEvent[];
  _count?: { events: number };
};

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

export type DocumentRecord = {
  id: string;
  ownerId: string;
  dossierType: string;
  dossierId: string;
  type: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  status: string;
  createdAt: string;
};

// Separate from apiFetch: multipart uploads must NOT set a JSON
// Content-Type — the browser sets the multipart boundary itself.
export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiRequestError(res.status, body.error ?? "UNKNOWN_ERROR", body.message);
  }
  return body as T;
}
