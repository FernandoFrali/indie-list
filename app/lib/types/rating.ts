export type RatingApi = {
  id: string;
  stars: number;
  description: string | null;
  userName: string;
  contentTitle: string;
  totalRatings: number;
  updatedAt: string;
  createdAt: string;
};

export type RatingsApi = RatingApi[];
