import { NextResponse } from "next/server";
import { db } from "@/db/database";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  );
}

async function generateUniqueSlug(title: string) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existing = await db
      .selectFrom("content")
      .select("id")
      .where("slug", "=", slug)
      .executeTakeFirst();

    if (!existing) break;

    count++;
    slug = `${baseSlug}-${count}`;
  }

  return slug;
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const publisherId = session?.user?.id;

    if (!publisherId) {
      return NextResponse.json({ error: "Não autorizado", data: null }, { status: 401 });
    }

    const role = session?.user?.role;

    if (role !== "publisher") {
      return NextResponse.json(
        { error: "Não autorizado. Apenas publicadores podem publicar", data: null },
        { status: 401 },
      );
    }

    const body = await req.json();

    const {
      title,
      description,
      thumbnail,
      banner,
      youtubeUrl,
      netflixUrl,
      hboUrl,
      amazonUrl,
      disneyUrl,
      otherStreaming,
      otherStreamingUrl,
    } = body;

    if (!title || !description || !thumbnail || !banner) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes", data: null },
        { status: 400 },
      );
    }

    if (otherStreaming && !otherStreamingUrl) {
      return NextResponse.json(
        { error: "URL do outro serviço de streaming ausente", data: null },
        {
          status: 400,
        },
      );
    }

    if (otherStreamingUrl && !otherStreaming) {
      return NextResponse.json(
        { error: "Nome do outro serviço de streaming ausente", data: null },
        { status: 400 },
      );
    }

    const slug = await generateUniqueSlug(title);

    await db
      .insertInto("content")
      .values({
        id: uuidv4(),
        title,
        description,
        thumbnail,
        banner,
        slug,
        publisherId,
        youtubeUrl,
        netflixUrl,
        hboUrl,
        amazonUrl,
        disneyUrl,
        otherStreaming,
        otherStreamingUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .execute();

    return NextResponse.json({ error: null, data: { slug } });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar conteúdo", data: null }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";

  try {
    const query = db
      .selectFrom("content")
      .leftJoin("rating", "rating.contentId", "content.id")
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
      .orderBy("averageStars", "desc")
      .orderBy("reviewsCount", "desc")
      .orderBy("content.createdAt", "desc")
      .where("content.title", "like", `%${q}%`);

    const contents = await query.execute();

    return NextResponse.json({ error: null, data: contents.length ? contents : [] });
  } catch (error: any) {
    console.log("error: ", error.message);
    return NextResponse.json(
      { error: `Erro ao buscar conteúdo: ${error.message}`, data: null },
      { status: 500 },
    );
  }
}
