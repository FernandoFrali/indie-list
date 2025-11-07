import Logo from "@/components/ui/logo";
import { getContents } from "../lib/content";
import SearchBar from "@/components/search-bar";
import Link from "next/link";
import Login from "@/components/login";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import Publish from "./publish";

export async function HeroSection({ q }: { q?: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
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
      <header className="flex h-20 text-c1 w-full py-5 px-5 md:px-10 justify-between items-center z-20">
        <Logo />
        <div className="flex items-center gap-4">
          <SearchBar q={q} />
          {session?.user?.email && session?.user?.role === "consumer" && (
            <Link href="/my-notes" className="text-c1 hover:underline text-base">
              Minhas Notas
            </Link>
          )}

          {session?.user?.email && session?.user?.role === "publisher" && <Publish />}
          <Login />
        </div>
      </header>

      <div className="flex flex-col items-center justify-center gap-3 w-full z-20 md:items-start">
        <h2 className="text-c1 text-xl font-medium relative truncate max-w-full px-2 md:hidden">
          {firstContent?.title || "Indie List, sua plataforma de filmes e séries indies"}
          <span className="text-c14 text-xl font-medium absolute left-0.5 top-0.5 w-full -z-10 truncate max-w-full px-2">
            {firstContent?.title || "Indie List, sua plataforma de filmes e séries indies"}
          </span>
        </h2>

        {firstContent?.slug && (
          <Link
            href={`/${firstContent?.slug}`}
            className="px-4 py-2 bg-c12 rounded-sm text-c1 font-medium hover:bg-c10 md:ml-10"
          >
            Saiba mais
          </Link>
        )}
      </div>

      <div className="w-full h-100 absolute bg-linear-to-b from-0% from-c14 via-transparent via-70% to-100% to-transparent z-10" />
    </div>
  );
}
