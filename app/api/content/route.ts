import { NextResponse } from "next/server";
import { db } from "@/db/database";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import type { ContentApi } from "@/app/lib/types/content";

type ContentQueryParams = {
  q?: string;
  limit?: string;
};

type CreateContentResponse = {
  error: string | null;
  data: {
    slug: string;
  };
};

type CreateContentBody = {
  title: string;
  amazonUrl?: string | null | undefined;
  banner?: string | null | undefined;
  createdAt?: string | undefined;
  description?: string | null | undefined;
  disneyUrl?: string | null | undefined;
  hboUrl?: string | null | undefined;
  netflixUrl?: string | null | undefined;
  otherStreaming?: string | null | undefined;
  otherStreamingUrl?: string | null | undefined;
  thumbnail?: string | null | undefined;
  updatedAt?: string | undefined;
  youtubeUrl?: string | null | undefined;
};

type GetContentResponse = {
  error: string | null;
  data: ContentApi[];
};

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

/**
 * @body CreateContentBody
 * @description Endpoint para criar um novo conteúdo
 * @bodyDescription Cria um novo conteúdo
 * @response CreateContentResponse
 * @responseDescription Retorna o slug do conteúdo criado
 */
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

/**
 * @response GetContentResponse
 * @description Endpoint para buscar conteúdos, podendo filtrar por palavra-chave e limite de resultados
 * @responseDescription Retorna uma lista de conteúdos
 * @params ContentQueryParams
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const limit = searchParams.get("limit")?.trim() || "";

  try {
    const query = db
      .selectFrom("content")
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
      .orderBy("averageStars", "desc")
      .orderBy("reviewsCount", "desc")
      .orderBy("content.createdAt", "desc")
      .limit(Number(limit) || 35)
      .where("content.title", "like", `%${q}%`);

    const contents = await query.execute();

    return NextResponse.json({ error: null, data: contents.length ? contents : [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro ao buscar conteúdo: ${error.message}`, data: null },
      { status: 500 },
    );
  }
}
