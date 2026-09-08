"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";

export function NavBar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="nav">
      <div className="navin">
        <Link href="/" className="logo">
          JTRANSPORT
        </Link>
        <div className="links">
          <Link href="/">Accueil</Link>
          <Link href="/missions">Missions</Link>
          <Link href="/mes-missions">Mes missions</Link>
          <Link href="/contrats">Contrats</Link>
          <Link href="/mon-entreprise">Mon entreprise</Link>
          <Link href="/prestataires">Prestataires</Link>
        </div>
        <div className="links" style={{ color: "var(--muted-on-navy)" }}>
          {loading ? null : user ? (
            <>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--blue-600), var(--blue-400))",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>
                {user.name} · {user.role}
              </span>
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  await logout();
                  router.push("/");
                  router.refresh();
                }}
              >
                Déconnexion
              </a>
            </>
          ) : (
            <>
              <Link href="/login">Connexion</Link>
              <Link href="/register">Créer un compte</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
