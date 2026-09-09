import * as SecureStore from "expo-secure-store";

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
};

export type ShipmentContainer = {
  id: string;
  containerNumber: string;
  type: string;
  originPort: string;
  destinationPort: string;
  vesselName: string | null;
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
  hsCode: string | null;
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
  recipientAddress: string;
  status: string;
  containerId: string | null;
  createdAt: string;
  parcels?: Parcel[];
  container?: ShipmentContainer | null;
  customsCase?: CustomsCase | null;
  events?: TrackingEvent[];
};

export type InvoiceLine = { id: string; description: string; quantity: number; unitPrice: number; amount: number };

export type Invoice = {
  id: string;
  number: string;
  contractId: string;
  issuerId: string;
  recipientId: string;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  dueDate: string | null;
  paidAt: string | null;
  eInvoicingStatus: "NOT_TRANSMITTED" | "TRANSMITTED" | "FAILED";
  createdAt: string;
  lines?: InvoiceLine[];
};

export type ConversationSummary = {
  id: string;
  subject: string | null;
  missionId: string | null;
  updatedAt: string;
  participants: { userId: string; user: { id: string; name: string; role: Role } }[];
  messages: { id: string; body: string; createdAt: string; senderId: string }[];
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  sender?: { id: string; name: string };
};

export type RoundStop = {
  id: string;
  roundId: string;
  position: number;
  label: string;
  address: string;
  parcelCode: string | null;
  recipient: string | null;
  status: "PENDING" | "IN_PROGRESS" | "DELIVERED" | "FAILED";
  podNote: string | null;
  failureReason: string | null;
  completedAt: string | null;
};

export type DeliveryRound = {
  id: string;
  reference: string;
  dispatcherId: string;
  driverId: string | null;
  date: string;
  status: "PLANNED" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  stops?: RoundStop[];
  driver?: { id: string; name: string } | null;
};

export type DocumentRecord = {
  id: string;
  dossierType: string;
  dossierId: string;
  type: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

// The phone can't reach "localhost" (that would be the phone itself), so
// this must be the computer's LAN IP while running through Expo Go in dev.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.20:4000";

const TOKEN_KEY = "jt_token";

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string | null): Promise<void> {
  if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message?: string) {
    super(message ?? code);
    this.status = status;
    this.code = code;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiRequestError(res.status, body.error ?? "UNKNOWN_ERROR", body.message);
  }

  return body as T;
}
