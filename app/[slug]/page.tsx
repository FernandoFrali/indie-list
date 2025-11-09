import { ChevronLeft, Star } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { getContent } from "../lib/content";
import { getStreamingList } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import WatchAtButton from "./components/watch-at";
import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "../lib/auth";
import Rate from "./components/rate";
import Ratings from "./components/ratings";
import OtherContents from "./components/other-contents";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent(slug).then((res) => res.data);

  if (!content) {
    return {
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
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    description: content.description,
    title: `${content.title} - Indie List`,
    keywords: [
      "indie",
      "indies",
      "séries",
      "series",
      "anime",
      "mangás",
      "manga",
      "mangas",
      "animes",
      "rating",
      "ratings",
    ],
    alternates: {
      canonical: `https://indie-list.frali.com.br/${slug}`,
    },
    openGraph: {
      title: `${content.title} - Indie List`,
      description: content.description,
      url: `https://indie-list.frali.com.br/${slug}`,
      siteName: "Indie List",
      type: "website",
      locale: "pt_BR",
      images: [
        {
          url: content.thumbnail || "https://indie-list.frali.com.br/images/banner-indielist.webp",
          width: 200,
          height: 300,
          alt: `Miniatura de ${content.title}`,
        },
        {
          url: content.banner || "https://indie-list.frali.com.br/images/banner-indielist.webp",
          width: 1920,
          height: 400,
          alt: `Banner de ${content.title}`,
        },
        ...previousImages,
      ],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const content = await getContent(slug, session?.user?.id).then((res) => res.data);

  if (slug === "404") {
    notFound();
  }

  if (!content) {
    redirect("/404");
  }

  const streamingList = getStreamingList(content);

  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex flex-col h-100 justify-between items-center bg-no-repeat bg-cover bg-top 3xl:bg-center pb-5"
        style={{
          backgroundImage: `url(${content?.banner || "/images/banner-indielist.webp"})`,
        }}
      >
        <header className="flex h-20 text-c1 w-full p-5 justify-between items-center z-20">
          <Link
            href="/"
            className="bg-[#FDFBFF]/30 h-10 w-10 rounded-full flex items-center justify-center text-c1 hover:bg-[#FDFBFF]/50"
          >
            <ChevronLeft size={20} />
          </Link>

          <div className="flex items-center bg-[#2A2A2A] px-2 py-3 md:px-3 rounded-sm text-c1 gap-1">
            <Star className="text-[#F0B100] size-3 md:size-4" />
            {content?.averageStars ? (
              <p className="text-xs md:text-base font-medium leading-6">
                {content?.averageStars?.toFixed(1)}/5
              </p>
            ) : (
              <p className="text-xs md:text-base font-medium leading-6">N/A</p>
            )}
          </div>
        </header>

        <div className="flex flex-col items-center justify-center gap-4 w-full z-20 px-10 md:items-start">
          <h1
            className="text-c1 text-[32px] md:text-[64px] font-medium break-words"
            style={{
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
            }}
          >
            {content?.title}
          </h1>

          <Suspense fallback={<div className="w-full h-full bg-c14 animate-pulse" />}>
            <WatchAtButton streamingList={streamingList} />
          </Suspense>

          <Suspense fallback={<div className="w-full h-full bg-c14 animate-pulse" />}>
            <Rate
              hasUser={!!session?.user?.id}
              userRating={content.userRating}
              contentSlug={content.slug}
            />
          </Suspense>
        </div>

        <div className="w-full h-100 absolute bg-linear-to-b from-0% from-transparent via-transparent via-70% to-100% to-black z-10" />
      </div>

      <main className="flex flex-col gap-8 py-5">
        <section className="flex flex-col gap-3 px-5">
          <h2 className="text-c1 text-base font-semibold">Descrição</h2>
          <p className="text-c1 text-base font-medium break-words">{content?.description}</p>
          <hr className="border-c1 w-full" />
        </section>

        <section className="flex flex-col gap-3 pl-5">
          <h2 className="text-c1 text-base font-semibold">
            Veja algumas <span className="text-c5">avaliações</span>:
          </h2>

          <Suspense fallback={<div className="w-full h-full bg-c14 animate-pulse" />}>
            <Ratings contentSlug={content.slug} />
          </Suspense>

          {content.reviewsCount > 0 && (
            <a
              className="text-c1 text-base font-semibold underline hover:no-underline w-fit"
              href={`/${content.slug}/reviews`}
            >
              Ver todas
            </a>
          )}
        </section>

        <section className="flex flex-col gap-3 pl-5">
          <h2 className="text-c1 text-base font-semibold">
            Outros <span className="text-c5">indies</span> interessantes:
          </h2>
          <OtherContents />
        </section>
      </main>
    </div>
  );
}
