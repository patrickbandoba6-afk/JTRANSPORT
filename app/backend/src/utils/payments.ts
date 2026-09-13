// PaymentProviderAdapter: the seam referenced from invoices.routes.ts for
// real online card collection (cahier des charges §15).
//
// IMPORTANT: no real PSP (Stripe/Adyen/...) is wired in here — there are no
// production API keys available in this codebase. CardProviderAdapter
// therefore always reports the honest outcome (PROVIDER_NOT_CONFIGURED),
// never a fabricated success — same rule as src/utils/einvoicing.ts. Wiring
// a real provider means: (1) get real credentials, (2) implement a new
// adapter class against that provider's real API, (3) swap it in below.
// Never mark a CARD payment SUCCEEDED unless a real adapter call actually
// succeeded.
export interface PaymentProviderAdapter {
  name: string;
  charge(input: { amount: number; currency: string }): Promise<
    | { status: "SUCCEEDED"; providerRef: string }
    | { status: "FAILED"; failureReason: string }
  >;
}

class CardProviderNotConfiguredAdapter implements PaymentProviderAdapter {
  name = "internal-noop";
  async charge(_input: { amount: number; currency: string }) {
    return { status: "FAILED" as const, failureReason: "PROVIDER_NOT_CONFIGURED" };
  }
}

export const cardProvider: PaymentProviderAdapter = new CardProviderNotConfiguredAdapter();

export function computeCommission(amount: number, rate: number) {
  const commissionAmount = Math.round(amount * rate * 100) / 100;
  const netAmount = Math.round((amount - commissionAmount) * 100) / 100;
  return { commissionAmount, netAmount };
}
