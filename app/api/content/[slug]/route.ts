import { NextResponse } from "next/server";
import { db } from "@/db/database";
import type { ContentApi } from "@/app/lib/types/content";

type GetContentResponse = {
  error: string | null;
  data: ContentApi;
};

type GetContentParams = {
  slug: string;
};

type GetContentQueryParams = {
  userId?: string;
};

/**
 * @response GetContentResponse
 * @description Endpoint para buscar conteúdos, podendo filtrar por palavra-chave, limite de resultados e passar o id do usuário para buscar sua avaliação junto ao conteúdo
 * @responseDescription Retorna um conteúdo pelo slug e sua nota
 * @pathParams GetContentParams
 * @params GetContentQueryParams
 */

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const awaitedParams = await params;
  const { slug } = awaitedParams;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId")?.trim();

  try {
    if (!slug) {
      return NextResponse.json({ error: "Conteúdo não encontrado", data: null }, { status: 404 });
    }

    const content = await db
      .selectFrom("content")
      .where("content.slug", "=", slug)
      .leftJoin("rating", "rating.contentSlug", "content.slug")
      .select([
        "content.id",
        "content.title",
        "content.description",
        "content.thumbnail",
        "content.banner",
        "content.youtubeUrl",
        "content.netflixUrl",
        "content.hboUrl",
        "content.amazonUrl",
        "content.disneyUrl",
        "content.otherStreaming",
        "content.otherStreamingUrl",
        "content.slug",
        "content.createdAt",
        "content.updatedAt",
        (eb) => eb.fn.avg("rating.stars").as("averageStars"),
        (eb) => eb.fn.count("rating.id").as("reviewsCount"),
      ])
      .groupBy("content.id")
      .executeTakeFirst();

    if (!content) {
      return NextResponse.json({ error: "Conteúdo não encontrado", data: null }, { status: 404 });
    }

    let userRating: { stars: number; description: string | null } | null = null;

    if (userId) {
      const rating = await db
        .selectFrom("rating")
        .select(["stars", "description"])
        .where("rating.contentSlug", "=", content.slug)
        .where("rating.userId", "=", userId)
        .executeTakeFirst();

      userRating = rating ? { stars: Number(rating.stars), description: rating.description } : null;
    }

    return NextResponse.json({
      error: null,
      data: {
        ...content,
        userRating,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar conteúdo", data: null }, { status: 500 });
  }
}
