import { NextResponse } from "next/server";
import { db } from "@/db/database";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import type { RatingsApi } from "@/app/lib/types/rating";

type GetRatingsResponse = {
  error: string | null;
  data: RatingsApi;
};

type GetRatingsParams = {
  limit?: string;
};

/**
 * @response GetRatingsResponse
 * @description Endpoint para buscar avaliações de conteúdos do usuário, podendo filtrar por limite de resultados
 * @responseDescription Retorna uma lista de avaliações de conteúdos do usuário
 * @params GetRatingsParams
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit")?.trim() || "";

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado", data: null }, { status: 401 });
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
        .where("rating.userId", "=", userId)
        .orderBy("rating.createdAt", "desc")
        .limit(Number(limit) || 10)
        .execute(),

      db
        .selectFrom("rating")
        .where("rating.userId", "=", userId)
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
