"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { ApiRequestError, type Role } from "../../lib/api";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("PARTICULIER");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register({ name, email, password, role });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiRequestError && err.code === "EMAIL_ALREADY_USED"
          ? "Un compte existe déjà avec cet e-mail."
          : "Inscription impossible pour le moment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container">
      <Link href="/">← Accueil</Link>
      <section className="section">
        <h1>Créer un compte</h1>
        <form className="card form" onSubmit={onSubmit}>
          <input
            className="input"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Mot de passe (8 caractères min.)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          <select className="select" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="PARTICULIER">Particulier — j'ai un besoin de transport</option>
            <option value="TRANSPORTEUR">Transporteur — je propose mes services</option>
          </select>
          {error && <p className="muted">{error}</p>}
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Création…" : "Créer mon compte"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>
          Déjà un compte ? <Link href="/login">Se connecter</Link>
        </p>
      </section>
    </main>
  );
}
