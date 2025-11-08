export type ContentApi = {
  id: string;
  title: string;
  thumbnail: string;
  banner: string;
  slug: string;
  description: string;
  youtubeUrl: string;
  netflixUrl: string;
  hboUrl: string;
  amazonUrl: string;
  disneyUrl: string;
  otherStreaming: string;
  otherStreamingUrl: string;
  averageStars: number;
  reviewsCount: number;
  userRating: { stars: number; description: string | null } | null;
  createdAt: string;
  updatedAt: string;
};

export type ContentsApi = ContentApi[];
