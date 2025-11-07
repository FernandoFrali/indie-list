import { NextResponse } from "next/server";
import { db } from "@/db/database";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: "Conteúdo não encontrado", data: null }, { status: 404 });
    }

    const content = await db
      .selectFrom("content")
      .where("slug", "=", slug)
      .leftJoin("rating", "rating.contentId", "content.id")
      .select([
        "id",
        "title",
        "description",
        "thumbnail",
        "banner",
        "youtubeUrl",
        "netflixUrl",
        "hboUrl",
        "amazonUrl",
        "disneyUrl",
        "otherStreaming",
        "otherStreamingUrl",
        "slug",
        "createdAt",
        "updatedAt",
        (eb) => eb.fn.avg("rating.stars").as("averageStars"),
        (eb) => eb.fn.count("rating.id").as("reviewsCount"),
      ])
      .groupBy("content.id")
      .executeTakeFirst();

    return NextResponse.json({ error: null, data: content });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar conteúdo", data: null }, { status: 500 });
  }
}
