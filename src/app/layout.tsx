import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { montserrat, poppins } from "@/app/fonts";
import "@/styles/globals.css";

const baseUrl = "https://nailpro.leonardocamargo.dev.br";
const title = "Nail Pro — Curso completo de alongamento de unhas";
const description =
  "Aprenda alongamento de unhas do preparo da unha natural à manutenção: fibra de vidro, gel na tip, molde e nail art, com aulas passo a passo, suporte e certificado.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: title,
    template: "%s | Nail Pro",
  },
  description,
  alternates: {
    canonical: "/",
  },
  icons: {
    // 1.5 KB instead of the 19 KB logo PNG: the favicon is fetched on every
    // visit and PageSpeed counts it against the LCP window.
    icon: "/media/nailpro/derived/brand-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: baseUrl,
    siteName: "Nail Pro",
    title,
    description,
    images: [
      {
        url: "/media/nailpro/derived/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Nail Pro — curso completo de alongamento de unhas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/media/nailpro/derived/og-cover.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
