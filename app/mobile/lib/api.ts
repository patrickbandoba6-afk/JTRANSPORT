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
  category: "MARCHANDISES" | "VOYAGEURS";
  fromCity: string;
  toCity: string;
  date: string;
  cargo: string | null;
  weightKg: number | null;
  seats: number | null;
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

export type ShipmentVehicle = {
  id: string;
  shipmentId: string;
  make: string;
  model: string;
  year: number | null;
  vin: string | null;
  plate: string | null;
  condition: string | null;
  valueDeclared: number | null;
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
  mode: "ROUTIER" | "MARITIME" | "AERIEN" | "FERROVIAIRE" | "MULTIMODAL";
  cargoType: "COLIS" | "MARCHANDISE" | "VEHICULE" | "CONTENEUR";
  status: string;
  containerId: string | null;
  createdAt: string;
  parcels?: Parcel[];
  vehicles?: ShipmentVehicle[];
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

export type Payment = {
  id: string;
  payerId: string;
  invoiceId: string | null;
  purpose: string;
  method: "CARD" | "VIREMENT" | "WALLET";
  amount: number;
  currency: string;
  commissionAmount: number;
  netAmount: number;
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  failureReason: string | null;
  createdAt: string;
  refunds?: { id: string; amount: number; status: string }[];
};

export type Wallet = { balance: number; currency: string };

export type Dispute = {
  id: string;
  contractId: string;
  openedById: string;
  category: "RETARD" | "DOMMAGE" | "COLIS_MANQUANT" | "DOUANE" | "DOCUMENTAIRE" | "PAIEMENT" | "DESACCORD_TARIFAIRE" | "AUTRE";
  description: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED" | "CLOSED";
  resolution: string | null;
  refundAmount: number | null;
  resolvedAt: string | null;
  createdAt: string;
  contract?: Contract;
  _count?: { messages: number };
  messages?: DisputeMessage[];
};

export type DisputeMessage = {
  id: string;
  disputeId: string;
  authorId: string;
  body: string;
  attachmentUrl: string | null;
  createdAt: string;
  author?: { id: string; name: string };
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
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://172.20.10.9:4000";

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

// Multipart upload (document scan, etc.) — must NOT set Content-Type
// manually so fetch can add the multipart boundary itself.
export async function apiUpload<T>(path: string, form: FormData): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: form,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiRequestError(res.status, body.error ?? "UNKNOWN_ERROR", body.message);
  }

  return body as T;
}
