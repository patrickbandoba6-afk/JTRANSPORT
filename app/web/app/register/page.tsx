"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { ApiRequestError, type Role } from "../../lib/api";

const ROLE_OPTIONS: { role: Role; icon: string; title: string; description: string }[] = [
  { role: "PARTICULIER", icon: "👤", title: "Particulier", description: "Pour vos envois personnels et vos achats en ligne" },
  { role: "PROFESSIONNEL", icon: "🏢", title: "Professionnel / Entreprise", description: "Pour gérer vos expéditions et vos activités" },
  { role: "TRANSPORTEUR", icon: "🚛", title: "Transporteur / Prestataire", description: "Pour proposer vos services de transport" },
  { role: "DISPATCHER", icon: "📦", title: "Dispatcher", description: "Pour gérer vos tournées et vos livreurs" },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function onSubmitStep1(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  async function onConfirmRole() {
    if (!role) return;
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
    <main className="container auth-wrap">
      <Link href={step === 1 ? "/" : "#"} onClick={step === 2 ? (e) => { e.preventDefault(); setStep(1); } : undefined}>
        ← {step === 1 ? "Accueil" : "Retour"}
      </Link>

      {step === 1 ? (
        <section className="section">
          <h1>Créer un compte</h1>
          <p className="muted">Étape 1 sur 2 — vos informations.</p>
          <form className="card form" onSubmit={onSubmitStep1}>
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
            <button className="btn" type="submit">
              Suivant →
            </button>
          </form>
          <p className="muted" style={{ marginTop: 12 }}>
            Déjà un compte ? <Link href="/login">Se connecter</Link>
          </p>
        </section>
      ) : (
        <section className="section">
          <h1>Quel type de compte ?</h1>
          <p className="muted">Étape 2 sur 2 — choisissez le profil qui vous correspond.</p>
          <div className="role-grid">
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.role}
                type="button"
                className={`role-option${role === opt.role ? " selected" : ""}`}
                onClick={() => setRole(opt.role)}
              >
                <span className="quick-icon">{opt.icon}</span>
                <span>
                  <strong>{opt.title}</strong>
                  <span className="muted">{opt.description}</span>
                </span>
              </button>
            ))}
          </div>
          {error && <p className="muted">{error}</p>}
          <button className="btn" disabled={!role || submitting} onClick={onConfirmRole} style={{ width: "100%" }}>
            {submitting ? "Création…" : "Continuer →"}
          </button>
        </section>
      )}
    </main>
  );
}
