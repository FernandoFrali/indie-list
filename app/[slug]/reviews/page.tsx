import { getRatings } from "@/app/lib/rating";
import Reviews from "@/components/reviews";
import SeeMore from "@/components/see-more";
import Logo from "@/components/ui/logo";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function Page({
  params,
  searchParams,
}: { params: Promise<{ slug: string }>; searchParams: Promise<{ limit?: string }> }) {
  const { slug } = await params;
  const queryParams = await searchParams;
  const ratings = await getRatings(slug, queryParams.limit || "10");

  if (ratings.error) {
    return (
      <p className="text-c1 text-sm font-medium">Erro ao carregar as avaliações: {ratings.error}</p>
    );
  }

  if (!ratings?.data?.length) {
    return <p className="text-c1 text-sm font-medium">Nenhuma avaliação encontrada</p>;
  }

  return (
    <main className="flex flex-col items-center gap-10">
      <header className="flex h-20 text-c1 w-full p-5 items-center z-20">
        <Link
          href={`/${slug}`}
          className="fixed left-5 top-5 bg-[#FDFBFF]/30 h-10 w-10 rounded-full flex items-center justify-center text-c1 hover:bg-[#FDFBFF]/50"
        >
          <ChevronLeft size={20} />
        </Link>

        <Logo className="mx-auto" />
      </header>

      <h1 className="text-c1 text-[32px] font-semibold">
        {ratings?.data[0]?.contentTitle || "Avaliações"}
      </h1>

      <Reviews ratings={ratings} />

      {queryParams.limit && Number(queryParams.limit) < (ratings?.data?.[0].totalRatings || 10) && (
        <SeeMore path={`${slug}/reviews`} limit={queryParams.limit} />
      )}
    </main>
  );
}
