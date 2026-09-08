"use client";

import { useAuth } from "../lib/auth-context";

export function Greeting() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;
  return <p className="greeting">Bonjour, {user.name.split(" ")[0]} 👋</p>;
}
