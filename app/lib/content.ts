"use server";

import { cacheLife, cacheTag, refresh, updateTag } from "next/cache";
import type { ApiResponse } from "./types/api";
import type { Content } from "kysely-codegen";
import type { Insertable } from "kysely";
import type { ContentApi, ContentsApi } from "./types/content";
import { headers } from "next/headers";

export const getContent = async (slug: string): Promise<ApiResponse<ContentApi>> => {
  "use cache";

  cacheTag(`contentsSlug-${slug}`, "contentsSlug");
  cacheLife("contentsSlug");

  const res = await fetch(`${process.env.API_BASE_URL}/api/content/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};

export const getContents = async (
  search?: string,
  perPage?: string,
): Promise<ApiResponse<ContentsApi>> => {
  "use cache";

  cacheTag(`contents-${search || "all"}`, "contents");
  cacheLife("contents");

  const queryParams = new URLSearchParams();
  queryParams.append("perPage", perPage || "");
  queryParams.append("q", search || "");

  const res = await fetch(`${process.env.API_BASE_URL}/api/content?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};

export async function createContent(
  payload: Omit<Insertable<Content>, "slug">,
): Promise<ApiResponse<string>> {
  const headersStore = await headers();
  const cookie = headersStore.get("cookie") || "";

  const res = await fetch(`${process.env.API_BASE_URL}/api/content`, {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
  });

  const { data, error }: { data: ContentApi; error: string | null } = await res.json();

  if (!res.ok || error) {
    return { error: error || res.statusText || "Erro ao criar conteúdo", data: null };
  }

  updateTag("contents");
  refresh();

  return { data: data.slug, error: null };
}
