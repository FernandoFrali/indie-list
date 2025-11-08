import Logo from "@/components/ui/logo";
import Link from "next/link";
import Login from "@/components/login";
import SearchBar from "@/components/search-bar";
import { Suspense } from "react";
import { HeroSection } from "./components/hero";
import { ContentsList } from "./components/contents-list";
import type { Metadata } from "next";

type SearchParams = {
  q?: string;
};

export const metadata: Metadata = {
  title: "Indie List | A sua plataforma de séries indies",
  description:
    "Seu indie favorito está aqui! Venha encontrar as melhores séries indies de qualidade e atualizadas. Sua obra merece ser vista!",
  alternates: {
    canonical: "https://indie-list.frali.com.br/",
  },
  openGraph: {
    type: "website",
    url: "https://indie-list.frali.com.br/",
    title: "Indie List",
    locale: "pt_BR",
    description: "Seu indie favorito está aqui!",
    images: [
      {
        url: "https://indie-list.frali.com.br/images/banner-indielist.webp",
        width: 1920,
        height: 400,
        alt: "Banner do indie list",
      },
    ],
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;

  return (
    <div className="flex flex-col relative">
      <Suspense
        fallback={
          <div className="flex flex-col h-100 justify-between items-center bg-no-repeat bg-cover bg-top 3xl:bg-center pb-5 bg-c14">
            <header className="flex h-20 text-c1 w-full p-5 justify-between items-center z-20">
              <Logo />
              <div className="flex items-center gap-4">
                <SearchBar q={q} />
                <Link href="/my-notes" className="text-c1 hover:underline text-base">
                  Minhas Notas
                </Link>
                <Login />
              </div>
            </header>

            <div className="flex flex-col items-center justify-center gap-3 w-full z-20">
              <h2 className="text-c1 text-xl font-medium">Carregando...</h2>
            </div>
          </div>
        }
      >
        <HeroSection q={q} />
      </Suspense>

      <main className="mt-5 flex flex-col items-center gap-5">
        <ContentsList q={q} />
      </main>
    </div>
  );
}
