import { NextResponse } from "next/server";
import { db } from "@/db/database";

export async function GET(req: Request) {
  try {
    const query = db
      .selectFrom("content")
      .leftJoin("rating", "rating.contentSlug", "content.slug")
      .select([
        "content.slug",
        (eb) => eb.fn.avg("rating.stars").as("averageStars"),
        (eb) => eb.fn.count("rating.id").as("reviewsCount"),
      ])
      .groupBy("content.id")
      .orderBy("averageStars", "desc")
      .orderBy("reviewsCount", "desc")
      .orderBy("content.createdAt", "desc");

    const contents = await query.execute();

    return NextResponse.json({ error: null, data: contents.length ? contents : [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro ao buscar conteúdo: ${error.message}`, data: null },
      { status: 500 },
    );
  }
}
