"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { ApiRequestError } from "../../lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiRequestError && err.code === "INVALID_CREDENTIALS"
          ? "E-mail ou mot de passe incorrect."
          : "Connexion impossible pour le moment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container auth-wrap">
      <Link href="/">← Accueil</Link>
      <section className="section">
        <h1>Connexion</h1>
        <p className="muted">Accédez à vos missions, offres et contrats JTransport.</p>
        <form className="card form" onSubmit={onSubmit}>
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
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="muted">{error}</p>}
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>
          Pas de compte ? <Link href="/register">Créer un compte</Link>
        </p>
      </section>
    </main>
  );
}
