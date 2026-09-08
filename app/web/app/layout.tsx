import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "JTransport Marketplace",
  description: "Marketplace de transport et de prestations logistiques"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}