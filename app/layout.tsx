import type { Metadata } from "next";
import { Inter, Signika_Negative } from "next/font/google";
import "./globals.css";
import Logo from "@/components/ui/logo";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const signika = Signika_Negative({
  variable: "--font-signika",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Indie List",
  description: "Seu indie favorito está aqui!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${signika.variable} antialiased`}>
        <Suspense
          fallback={
            <Logo className="flex h-screen w-screen items-center justify-center animate-pulse" />
          }
        >
          {children}
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
