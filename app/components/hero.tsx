import Logo from "@/components/ui/logo";
import { getContents } from "../lib/content";
import SearchBar from "@/components/search-bar";
import Link from "next/link";
import Login from "@/components/login";

export async function HeroSection({ q }: { q?: string }) {
  const contents = await getContents(q)
    .then((res) => res.data)
    .catch(() => []);

  const firstContent = contents?.[0];

  return (
    <div
      className="flex flex-col h-100 justify-between items-center bg-no-repeat bg-cover bg-top 3xl:bg-center pb-5"
      style={{
        backgroundImage: `url(${firstContent?.banner || "/images/banner-indielist.webp"})`,
      }}
    >
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
        <h2 className="text-c1 text-xl font-medium">
          {firstContent?.title || "Indie List, sua plataforma de filmes e séries indies"}
        </h2>
        {firstContent?.slug && (
          <Link
            href={`/contents/${firstContent?.slug}`}
            className="px-4 py-2 bg-c12 rounded-sm text-c1 font-medium hover:bg-c10"
          >
            Saiba mais
          </Link>
        )}
      </div>
      <div className="w-full h-100 absolute bg-linear-to-b from-0% from-c14 to-transparent to-100% z-10" />
    </div>
  );
}
