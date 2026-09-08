import "./globals.css";
import type { ReactNode } from "react";
import { AuthProvider } from "../lib/auth-context";
import { NavBar } from "../components/NavBar";

export const metadata = {
  title: "JTransport Marketplace",
  description: "Marketplace de transport et de prestations logistiques"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
