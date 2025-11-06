import { cacheLife, cacheTag, updateTag } from "next/cache";
import type { ApiResponse } from "./types/api";
import type { Contents } from "./types/content";

export const getContents = async (search?: string): Promise<ApiResponse<Contents>> => {
  "use cache";

  cacheTag("contents");
  cacheLife("contents");
  // const res = await fetch("");

  // return res.json();

  return {
    data: [
      {
        id: "1",
        title: "Echoes of the sunset",
        thumbnail: "/images/echoes-of-the-sunset-thumb.png",
        banner: "/images/echoes-of-the-sunset-banner.png",
        slug: "echoes-of-the-sunset-1",
        description:
          "Echoes of the Sunset é um filme que mistura a solidão contemplativa de uma jornada de autodescoberta com a vastidão melancólica da paisagem americana. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        netflixUrl: "https://www.netflix.com/watch/123456789",
        hboUrl: "https://www.hbo.com/watch/123456789",
        amazonUrl: "https://www.amazon.com/watch/123456789",
        disneyUrl: "https://www.disney.com/watch/123456789",
        otherSreaming: "MeliPlay",
        otherSreamingUrl: "https://www.meliplay.com/watch/123456789",
      },
      {
        id: "2",
        title: "Echoes of the sunset",
        thumbnail: "/images/echoes-of-the-sunset-thumb.png",
        banner: "/images/echoes-of-the-sunset-banner.png",
        slug: "echoes-of-the-sunset-2",
        description:
          "Echoes of the Sunset é um filme que mistura a solidão contemplativa de uma jornada de autodescoberta com a vastidão melancólica da paisagem americana. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        netflixUrl: "https://www.netflix.com/watch/123456789",
        hboUrl: "https://www.hbo.com/watch/123456789",
        amazonUrl: "https://www.amazon.com/watch/123456789",
        disneyUrl: "https://www.disney.com/watch/123456789",
        otherSreaming: "MeliPlay",
        otherSreamingUrl: "https://www.meliplay.com/watch/123456789",
      },
      {
        id: "3",
        title: "Echoes of the sunset",
        thumbnail: "/images/echoes-of-the-sunset-thumb.png",
        banner: "/images/echoes-of-the-sunset-banner.png",
        slug: "echoes-of-the-sunset-3",
        description:
          "Echoes of the Sunset é um filme que mistura a solidão contemplativa de uma jornada de autodescoberta com a vastidão melancólica da paisagem americana. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        netflixUrl: "https://www.netflix.com/watch/123456789",
        hboUrl: "https://www.hbo.com/watch/123456789",
        amazonUrl: "https://www.amazon.com/watch/123456789",
        disneyUrl: "https://www.disney.com/watch/123456789",
        otherSreaming: "MeliPlay",
        otherSreamingUrl: "https://www.meliplay.com/watch/123456789",
      },
      {
        id: "4",
        title: "Echoes of the sunset",
        thumbnail: "/images/echoes-of-the-sunset-thumb.png",
        banner: "/images/echoes-of-the-sunset-banner.png",
        slug: "echoes-of-the-sunset-4",
        description:
          "Echoes of the Sunset é um filme que mistura a solidão contemplativa de uma jornada de autodescoberta com a vastidão melancólica da paisagem americana. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        netflixUrl: "https://www.netflix.com/watch/123456789",
        hboUrl: "https://www.hbo.com/watch/123456789",
        amazonUrl: "https://www.amazon.com/watch/123456789",
        disneyUrl: "https://www.disney.com/watch/123456789",
        otherSreaming: "MeliPlay",
        otherSreamingUrl: "https://www.meliplay.com/watch/123456789",
      },
    ],
    error: null,
  };
};

export async function createContent(post: unknown) {
  "use server";
  const res = await fetch("/api/contents", {
    method: "POST",
    body: JSON.stringify(post),
    headers: {
      "Content-Type": "application/json",
    },
  });

  updateTag("contents");

  return res.json();
}
