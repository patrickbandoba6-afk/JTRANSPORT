// EInvoicingProviderAdapter: the seam for a real "plateforme agréée"
// (Chorus Pro, a DGFiP-registered PDP, Peppol access point...).
//
// IMPORTANT — do not weaken this without re-reading the cahier des charges:
// a platform's "agréé"/certified status must be verified against the
// official DGFiP source at the time of integration, never asserted from
// memory or a commercial vendor's own claim, and the verification date
// must be recorded. This file intentionally ships NO real provider — only
// a no-op internal adapter — because no such verification has been done
// here. Wiring a real provider means: (1) verify + record its approval
// status from the official source, (2) implement a new adapter class
// against that provider's real API with real credentials, (3) swap it in
// below. Never mark eInvoicingStatus as "TRANSMITTED" unless an adapter
// call actually succeeded against a real platform.
export interface EInvoicingProviderAdapter {
  name: string;
  transmit(input: { invoiceId: string }): Promise<{ status: "TRANSMITTED" | "FAILED"; provider: string }>;
}

class InternalNoopAdapter implements EInvoicingProviderAdapter {
  name = "internal-noop";
  async transmit(_input: { invoiceId: string }) {
    // No real e-invoicing platform is connected. This never transmits
    // anything — it exists so the API shape (and the UI's honesty about
    // "not transmitted") is correct from day one.
    return { status: "FAILED" as const, provider: this.name };
  }
}

export const einvoicingProvider: EInvoicingProviderAdapter = new InternalNoopAdapter();
