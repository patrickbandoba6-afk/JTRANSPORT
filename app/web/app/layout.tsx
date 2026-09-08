import "./globals.css";
import type { ReactNode } from "react";
import { AuthProvider } from "../lib/auth-context";
import { NavBar } from "../components/NavBar";
import { AppBootstrap } from "../components/AppBootstrap";

export const metadata = {
  title: "JTransport Marketplace",
  description: "Marketplace de transport et de prestations logistiques"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <AppBootstrap>
            <NavBar />
            {children}
          </AppBootstrap>
        </AuthProvider>
      </body>
    </html>
  );
}
