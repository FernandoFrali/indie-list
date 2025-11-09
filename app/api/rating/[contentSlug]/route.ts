import { NextResponse } from "next/server";
import { db } from "@/db/database";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import type { RatingsApi } from "@/app/lib/types/rating";

type RatingQueryParams = {
  stars: string;
  description?: string;
};

type RatingBody = {
  rating: number;
  description?: string;
};

type RatingResponse = {
  error: string | null;
  data: {
    success: boolean;
  };
};

type GetRatingsResponse = {
  error: string | null;
  data: RatingsApi;
};

type GetRatingsParams = {
  limit?: string;
};

type GetRatingsPathParams = {
  contentSlug: string;
};

/**
 * @body RatingBody
 * @description Endpoint para avaliar um conteúdo específico
 * @bodyDescription Avalia um conteúdo específico
 * @response RatingResponse
 * @responseDescription Retorna se teve sucesso ao fazer a avaliação
 * @pathParams GetRatingsPathParams
 */
export async function POST(req: Request, { params }: { params: Promise<{ contentSlug: string }> }) {
  const awaitedParams = await params;
  const { contentSlug } = awaitedParams;

  try {
    if (!contentSlug) {
      return NextResponse.json({ error: "Conteúdo não encontrado", data: null }, { status: 404 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado", data: null }, { status: 401 });
    }

    const body = await req.json();

    const { rating, description } = body;

    if (!rating) {
      return NextResponse.json(
        { error: "Campo obrigatório ausente. Avalie o conteúdo", data: null },
        { status: 400 },
      );
    }

    await db
      .insertInto("rating")
      .values({
        id: uuidv4(),
        userId,
        contentSlug,
        stars: rating,
        description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .execute();

    return NextResponse.json({ error: null, data: { success: true } });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar conteúdo", data: null }, { status: 500 });
  }
}

/**
 * @body RatingBody
 * @description Endpoint para atualizar a avaliação do usuário em um conteúdo específico
 * @bodyDescription Atualiza a avaliação de um conteúdo específico
 * @response RatingResponse
 * @responseDescription Retorna se teve sucesso na atualização da avaliação
 * @pathParams GetRatingsPathParams
 */
export async function PUT(req: Request, { params }: { params: Promise<{ contentSlug: string }> }) {
  const awaitedParams = await params;
  const { contentSlug } = awaitedParams;

  try {
    if (!contentSlug) {
      return NextResponse.json({ error: "Conteúdo não encontrado", data: null }, { status: 404 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado", data: null }, { status: 401 });
    }

    const body = await req.json();

    const { rating, description } = body;

    if (!rating) {
      return NextResponse.json(
        { error: "Campo obrigatório ausente. Avalie o conteúdo", data: null },
        { status: 400 },
      );
    }

    await db
      .updateTable("rating")
      .set({
        stars: rating,
        description,
        updatedAt: new Date().toISOString(),
      })
      .where("rating.contentSlug", "=", contentSlug)
      .where("rating.userId", "=", userId)
      .execute();

    return NextResponse.json({ error: null, data: { success: true } });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar conteúdo", data: null }, { status: 500 });
  }
}

/**
 * @response GetRatingsResponse
 * @description Endpoint para buscar avaliações de um conteúdo específico, podendo filtrar por limite de resultados
 * @responseDescription Retorna uma lista de avaliações de um conteúdo específico
 * @params GetRatingsParams
 * @pathParams GetRatingsPathParams
 */
export async function GET(req: Request, { params }: { params: Promise<{ contentSlug: string }> }) {
  const awaitedParams = await params;
  const { contentSlug } = awaitedParams;
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit")?.trim() || "";

  try {
    if (!contentSlug) {
      return NextResponse.json({ error: "Conteúdo não encontrado", data: null }, { status: 404 });
    }

    const [ratings, { ratingsCount }] = await Promise.all([
      db
        .selectFrom("rating")
        .leftJoin("user", "user.id", "rating.userId")
        .leftJoin("content", "content.slug", "rating.contentSlug")
        .select([
          "rating.id",
          "rating.stars",
          "rating.description",
          "rating.updatedAt",
          "rating.createdAt",
          "content.title as contentTitle",
          "user.name as userName",
        ])
        .where("rating.contentSlug", "=", contentSlug)
        .orderBy("rating.createdAt", "desc")
        .limit(Number(limit) || 10)
        .execute(),

      db
        .selectFrom("rating")
        .where("rating.contentSlug", "=", contentSlug)
        .select((eb) => eb.fn.count("rating.id").as("ratingsCount"))
        .executeTakeFirstOrThrow(),
    ]);

    const ratingsDto = ratings.map((ratingDto) => ({
      id: ratingDto.id,
      stars: Number(ratingDto.stars),
      description: ratingDto.description,
      userName: ratingDto.userName,
      contentTitle: ratingDto.contentTitle,
      totalRatings: Number(ratingsCount),
      createdAt: ratingDto.createdAt,
      updatedAt: ratingDto.updatedAt,
    }));

    return NextResponse.json({ error: null, data: ratingsDto });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar avaliações", data: null }, { status: 500 });
  }
}
