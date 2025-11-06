import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface Database {
  user: UserTable;
  content: ContentTable;
  rating: RatingTable;
}

export interface UserTable {
  id: Generated<string>;

  name: string;
  email: string;
  emailVerified: boolean | null;
  password: string;
  role: "consumer" | "publisher";
  image: string | null;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string | undefined>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type PersonUpdate = Updateable<UserTable>;

export interface ContentTable {
  id: Generated<string>;

  description: string;
  thumbnail: string;
  banner: string;
  title: string;
  slug: string;
  publisher_id: ColumnType<string, string, string | undefined>;

  youtubeUrl: string | null;
  netflixUrl: string | null;
  hboUrl: string | null;
  amazonUrl: string | null;
  disneyUrl: string | null;

  otherSreaming: string | null;
  otherSreamingUrl: string | null;

  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string | undefined>;
}

export type Content = Selectable<ContentTable>;
export type NewContent = Insertable<ContentTable>;
export type ContentUpdate = Updateable<ContentTable>;

export interface RatingTable {
  id: Generated<string>;

  contentId: ColumnType<string, string, undefined>;
  userId: ColumnType<string, string, undefined>;
  stars: ColumnType<number, number, number | undefined>;
  description: string | null;

  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string | undefined>;
}

export type Rating = Selectable<RatingTable>;
export type NewRating = Insertable<RatingTable>;
export type RatingUpdate = Updateable<RatingTable>;
