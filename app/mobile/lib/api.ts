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
