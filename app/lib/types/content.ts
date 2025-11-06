export type Content = {
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
};

export type Contents = Content[];
