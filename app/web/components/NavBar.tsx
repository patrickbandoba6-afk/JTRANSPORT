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
          <Link href="/publier">Publier une mission</Link>
          <Link href="/prestataires">Prestataires</Link>
        </div>
        <div className="links">
          {loading ? null : user ? (
            <>
              <span className="muted">
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
