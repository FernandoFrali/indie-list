import type { ContentApi } from "@/app/lib/types/content";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStreamingList(content: ContentApi) {
  if (!content) return [];

  const streamingList = [];

  if (content.netflixUrl) {
    streamingList.push({
      name: "Netflix",
      url: content.netflixUrl,
    });
  }

  if (content.amazonUrl) {
    streamingList.push({
      name: "Amazon Prime",
      url: content.amazonUrl,
    });
  }

  if (content.hboUrl) {
    streamingList.push({
      name: "HBO",
      url: content.hboUrl,
    });
  }

  if (content.youtubeUrl) {
    streamingList.push({
      name: "YouTube",
      url: content.youtubeUrl,
    });
  }

  if (content.disneyUrl) {
    streamingList.push({
      name: "Disney+",
      url: content.disneyUrl,
    });
  }

  if (content.otherStreamingUrl) {
    streamingList.push({
      name: content.otherStreaming || "Outro",
      url: content.otherStreamingUrl,
    });
  }

  return streamingList;
}
