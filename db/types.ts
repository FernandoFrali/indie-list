import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface Database {
  user: UserTable;
  content: ContentTable;
  rating: RatingTable;
}

export interface UserTable {
  id: Generated<string>;

  email: string;
  password: string;
  role: "consumer" | "publisher";

  avatar: string | null;

  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string | undefined>;
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

  youtube_url: string | null;
  netflix_url: string | null;
  hbo_url: string | null;
  amazon_url: string | null;
  disney_url: string | null;

  other_sreaming: string | null;
  other_sreaming_url: string | null;

  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string | undefined>;
}

export type Content = Selectable<ContentTable>;
export type NewContent = Insertable<ContentTable>;
export type ContentUpdate = Updateable<ContentTable>;

export interface RatingTable {
  id: Generated<string>;

  content_id: ColumnType<string, string, undefined>;
  user_id: ColumnType<string, string, undefined>;
  stars: ColumnType<number, number, number | undefined>;
  description: string | null;

  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string | undefined>;
}

export type Rating = Selectable<RatingTable>;
export type NewRating = Insertable<RatingTable>;
export type RatingUpdate = Updateable<RatingTable>;
