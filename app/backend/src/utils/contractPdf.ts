import PDFDocument from "pdfkit";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Contract, User } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = path.join(__dirname, "..", "assets", "logo.png");

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

// Deterministic color from the name so the same person always gets the
// same avatar color across documents.
function colorFor(name: string): string {
  const palette = ["#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % palette.length;
  return palette[Math.abs(hash) % palette.length];
}

function drawAvatar(doc: PDFKit.PDFDocument, x: number, y: number, name: string) {
  const radius = 20;
  doc.save();
  doc.circle(x + radius, y + radius, radius).fill(colorFor(name));
  doc
    .fillColor("#ffffff")
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(initials(name), x, y + radius - 7, { width: radius * 2, align: "center" });
  doc.restore();
  doc.fillColor("#111827");
}

export type ContractPdfInput = {
  contract: Contract;
  owner: Pick<User, "id" | "name" | "email">;
  counterparty: Pick<User, "id" | "name" | "email">;
  missionRoute?: { fromCity: string; toCity: string } | null;
};

// Real-only rendering: every value printed comes from the actual contract
// record (price, terms, signature timestamps). Nothing here is invented —
// no fabricated legal clauses, no fake "official" seal. Signatures shown
// are JTransport's own internal click-to-sign audit trail (see
// src/utils/signature.ts), never presented as a qualified e-signature.
export function generateContractPdf(input: ContractPdfInput): PDFKit.PDFDocument {
  const { contract, owner, counterparty, missionRoute } = input;
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  try {
    doc.image(LOGO_PATH, 50, 45, { width: 42 });
  } catch {
    // Logo optional — never fail the whole document over a missing asset.
  }
  doc.fontSize(18).font("Helvetica-Bold").text("JTransport", 100, 50);
  doc.fontSize(9).font("Helvetica").fillColor("#64748b").text("Tout votre transport, au même endroit", 100, 72);
  doc.fillColor("#111827");

  doc.moveDown(3);
  doc.fontSize(15).font("Helvetica-Bold").text(`Contrat ${contract.type} — ${contract.id}`);
  doc.fontSize(9).font("Helvetica").fillColor("#64748b").text(`Statut : ${contract.status}`);
  doc.fillColor("#111827");
  if (missionRoute) {
    doc.moveDown(0.5);
    doc.fontSize(11).font("Helvetica").text(`Trajet : ${missionRoute.fromCity} → ${missionRoute.toCity}`);
  }

  doc.moveDown(1.5);
  const partiesTop = doc.y;
  drawAvatar(doc, 50, partiesTop, owner.name);
  doc.fontSize(9).font("Helvetica-Bold").text("Donneur d'ordre", 100, partiesTop + 2);
  doc.font("Helvetica").fontSize(10).text(owner.name, 100, partiesTop + 15);
  doc.fontSize(8).fillColor("#64748b").text(owner.email, 100, partiesTop + 30);
  doc.fillColor("#111827");

  drawAvatar(doc, 320, partiesTop, counterparty.name);
  doc.fontSize(9).font("Helvetica-Bold").text("Prestataire", 370, partiesTop + 2);
  doc.font("Helvetica").fontSize(10).text(counterparty.name, 370, partiesTop + 15);
  doc.fontSize(8).fillColor("#64748b").text(counterparty.email, 370, partiesTop + 30);
  doc.fillColor("#111827");

  doc.y = partiesTop + 60;
  doc.moveDown(1.5);
  doc.fontSize(12).font("Helvetica-Bold").text("Conditions");
  doc.moveDown(0.3);
  doc.fontSize(10).font("Helvetica").text(`Montant : ${contract.price.toFixed(2)} €`);
  if (contract.terms) {
    doc.moveDown(0.3);
    doc.text(contract.terms);
  }

  doc.moveDown(1.5);
  doc.fontSize(12).font("Helvetica-Bold").text("Signatures");
  doc.moveDown(0.3);
  doc
    .fontSize(10)
    .font("Helvetica")
    .text(
      `Donneur d'ordre : ${contract.ownerSignedAt ? "signé le " + new Date(contract.ownerSignedAt).toLocaleString("fr-FR") : "non signé"}`,
    );
  doc.text(
    `Prestataire : ${contract.counterpartySignedAt ? "signé le " + new Date(contract.counterpartySignedAt).toLocaleString("fr-FR") : "non signé"}`,
  );

  doc.moveDown(2);
  doc
    .fontSize(7.5)
    .fillColor("#94a3b8")
    .text(
      "Document généré par JTransport à partir des données du contrat. La signature ci-dessus est une signature interne horodatée et tracée, non une signature électronique qualifiée.",
      { width: 495 },
    );

  return doc;
}
