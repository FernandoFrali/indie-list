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
 * @responseDescription Retorna um conteúdo pelo slug. Traz a avaliação do usuário logado, e as notas de avaliação do conteúdo.
 * @pathParams GetContentParams
 * @params GetContentQueryParams
 */

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const awaitedParams = await params;
  const { slug } = awaitedParams;

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

    return NextResponse.json({
      error: null,
      data: content,
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar conteúdo", data: null }, { status: 500 });
  }
}
