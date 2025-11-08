"use server";

import { refresh, updateTag } from "next/cache";
import type { Rating } from "kysely-codegen";
import { headers } from "next/headers";
import type { RatingsApi } from "./types/rating";

export async function rateContent(rating: number, contentSlug: string, description?: string) {
  const headersStore = await headers();
  const cookie = headersStore.get("cookie") || "";

  const res = await fetch(`${process.env.API_BASE_URL}/api/rating/${contentSlug}`, {
    method: "POST",
    body: JSON.stringify({ rating, description }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
  });

  const { data, error }: { data: Rating & { error: null }; error: string | null } =
    await res.json();

  if (!res.ok || error) {
    return { error: error || res.statusText || "Erro ao avaliar conteúdo", data: null };
  }

  updateTag("ratings");
  updateTag("contentsSlug");
  updateTag("contents");
  refresh();

  return { data, error: null };
}

export async function updateRating(rating: number, contentSlug: string, description?: string) {
  const headersStore = await headers();
  const cookie = headersStore.get("cookie") || "";

  const res = await fetch(`${process.env.API_BASE_URL}/api/rating/${contentSlug}`, {
    method: "PUT",
    body: JSON.stringify({ rating, description }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
  });

  const { data, error }: { data: Rating & { error: null }; error: string | null } =
    await res.json();

  if (!res.ok || error) {
    return { error: error || res.statusText || "Erro ao atualizar avaliação", data: null };
  }

  updateTag("ratings");
  updateTag("contentsSlug");
  updateTag("contents");
  refresh();

  return { data, error: null };
}

export async function getRatings(contentSlug: string, limit?: string) {
  const headersStore = await headers();
  const cookie = headersStore.get("cookie") || "";

  const res = await fetch(
    `${process.env.API_BASE_URL}/api/rating/${contentSlug}${limit ? `?limit=${limit}` : ""}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
    },
  );

  const { data, error }: { data: RatingsApi; error: string | null } = await res.json();

  if (!res.ok || error) {
    return { error: error || res.statusText || "Erro ao buscar avaliações", data: null };
  }

  return { data, error: null };
}

export async function getUserRatings(limit?: string) {
  const headersStore = await headers();
  const cookie = headersStore.get("cookie") || "";

  const res = await fetch(
    `${process.env.API_BASE_URL}/api/rating${limit ? `?limit=${limit}` : ""}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
    },
  );

  const { data, error }: { data: RatingsApi; error: string | null } = await res.json();

  if (!res.ok || error) {
    return { error: error || res.statusText || "Erro ao buscar avaliações", data: null };
  }

  return { data, error: null };
}
