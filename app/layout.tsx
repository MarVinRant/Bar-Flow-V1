import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bar Flow — Operação de bebidas, mais fluida",
  description: "Organize receitas, produtos e cardápios da sua operação de bebidas.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
