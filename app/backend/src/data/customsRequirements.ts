// Indicative customs paperwork checklist, kept as data (not code) because
// requirements differ by country and change over time — an administrator
// must be able to edit them without a release. Shown to users as guidance,
// never as legal advice.
export const DEFAULT_CUSTOMS_REQUIREMENTS: {
  mode: string | null;
  cargoType: string | null;
  documentType: string;
  label: string;
  mandatory: boolean;
  note?: string;
}[] = [
  { mode: null, cargoType: null, documentType: "FACTURE", label: "Facture commerciale / proforma", mandatory: true },
  { mode: null, cargoType: null, documentType: "DOUANE", label: "Packing list (détail du contenu)", mandatory: true },
  {
    mode: null,
    cargoType: null,
    documentType: "DOUANE",
    label: "Certificat d'origine",
    mandatory: false,
    note: "Selon le pays de destination et l'accord commercial applicable.",
  },
  { mode: "MARITIME", cargoType: null, documentType: "DOUANE", label: "Connaissement maritime (B/L)", mandatory: true },
  { mode: "MARITIME", cargoType: "CONTENEUR", documentType: "DOUANE", label: "Liste de chargement du conteneur", mandatory: true },
  { mode: "AERIEN", cargoType: null, documentType: "DOUANE", label: "Lettre de transport aérien (AWB)", mandatory: true },
  { mode: "ROUTIER", cargoType: null, documentType: "DOUANE", label: "Lettre de voiture CMR", mandatory: true },
  { mode: "FERROVIAIRE", cargoType: null, documentType: "DOUANE", label: "Lettre de voiture ferroviaire (CIM)", mandatory: true },
  { mode: null, cargoType: "VEHICULE", documentType: "DOUANE", label: "Carte grise / certificat d'immatriculation", mandatory: true },
  { mode: null, cargoType: "VEHICULE", documentType: "DOUANE", label: "Certificat de cession ou facture d'achat", mandatory: true },
  { mode: null, cargoType: "VEHICULE", documentType: "ASSURANCE", label: "Attestation d'assurance du véhicule", mandatory: false },
  { mode: null, cargoType: null, documentType: "ASSURANCE", label: "Assurance transport de la marchandise", mandatory: false },
];
