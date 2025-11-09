import { NextResponse } from "next/server";
import { db } from "@/db/database";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import type { RatingApi } from "@/app/lib/types/rating";

type GetRatingsResponse = {
  error: string | null;
  data: RatingApi | null;
};

type GetRatingsPathParams = {
  contentSlug: string;
};

/**
 * @response GetRatingsResponse
 * @description Endpoint para buscar a avaliação do usuário em um conteúdo específico
 * @responseDescription Retorna a avaliação do usuário em um conteúdo específico
 * @pathParams GetRatingsPathParams
 */
export async function GET(req: Request, { params }: { params: Promise<{ contentSlug: string }> }) {
  const awaitedParams = await params;
  const { contentSlug } = awaitedParams;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado", data: null }, { status: 401 });
    }

    if (!contentSlug) {
      return NextResponse.json({ error: "Conteúdo não encontrado", data: null }, { status: 404 });
    }

    const rating = await db
      .selectFrom("rating")
      .select(["stars", "description"])
      .where("rating.contentSlug", "=", contentSlug)
      .where("rating.userId", "=", userId)
      .executeTakeFirst();

    return NextResponse.json({ error: null, data: rating });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar avaliações", data: null }, { status: 500 });
  }
}
