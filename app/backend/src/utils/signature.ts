// EContractProviderAdapter: swap InternalClickToSignAdapter for a real
// e-signature provider (DocuSign, Yousign...) by implementing this same
// interface. The internal adapter below is a plain timestamped audit
// record — it has no qualified legal signature value. Never present it to
// users as more than "signature interne horodatée" (see cahier des
// charges §7 / §14: "ne pas inventer une valeur juridique de la signature").
export interface ESignatureProviderAdapter {
  sign(input: { contractId: string; signerId: string }): Promise<{ signedAt: Date; method: string }>;
}

export class InternalClickToSignAdapter implements ESignatureProviderAdapter {
  async sign(input: { contractId: string; signerId: string }) {
    return { signedAt: new Date(), method: "internal_click_to_sign" };
  }
}

export const signatureProvider: ESignatureProviderAdapter = new InternalClickToSignAdapter();
