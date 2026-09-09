"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { API_URL, apiFetch, apiUpload, type DocumentRecord } from "../lib/api";

const DOCUMENT_TYPES = ["FACTURE", "BON_LIVRAISON", "POD", "CONTRAT", "ASSURANCE", "DOUANE", "AUTRE"];

export function DocumentsPanel({ dossierType, dossierId }: { dossierType: string; dossierId: string }) {
  const [documents, setDocuments] = useState<DocumentRecord[] | null>(null);
  const [docType, setDocType] = useState(DOCUMENT_TYPES[0]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ documents: DocumentRecord[] }>(
        `/api/documents?dossierType=${dossierType}&dossierId=${dossierId}`,
      );
      setDocuments(data.documents);
    } catch {
      setDocuments([]);
    }
  }, [dossierType, dossierId]);

  useEffect(() => {
    load();
  }, [load]);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("dossierType", dossierType);
      formData.append("dossierId", dossierId);
      formData.append("type", docType);
      await apiUpload("/api/documents", formData);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await load();
    } catch {
      setError("Envoi impossible (PDF/JPEG/PNG/WEBP, 15 Mo max).");
    } finally {
      setUploading(false);
    }
  }

  async function download(doc: DocumentRecord) {
    const data = await apiFetch<{ url: string }>(`/api/documents/${doc.id}/signed-url`);
    window.open(`${API_URL}${data.url}`, "_blank");
  }

  return (
    <div>
      <h2>📁 Documents</h2>
      {documents === null && <p className="muted">Chargement…</p>}
      {documents?.length === 0 && <p className="muted">Aucun document.</p>}
      <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        {documents?.map((doc) => (
          <div key={doc.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span className="tag">{doc.type}</span>
              <p style={{ margin: "4px 0 0" }}>{doc.filename}</p>
              <p className="muted">{(doc.sizeBytes / 1024).toFixed(0)} Ko</p>
            </div>
            <button className="btn secondary" onClick={() => download(doc)}>Télécharger</button>
          </div>
        ))}
      </div>

      <form className="form" onSubmit={onUpload}>
        <select className="select" value={docType} onChange={(e) => setDocType(e.target.value)}>
          {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input ref={fileInputRef} className="input" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" required />
        {error && <p className="muted">{error}</p>}
        <button className="btn secondary" type="submit" disabled={uploading}>
          {uploading ? "Envoi…" : "+ Ajouter un document"}
        </button>
      </form>
    </div>
  );
}
