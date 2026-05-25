import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Pessoal",
  description: "Networking organizado por esferas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
