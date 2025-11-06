import type { Database } from "./types";
import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

export const dialect = new SqliteDialect({
  database: new SQLite("db/db.sqlite"),
});

export const db = new Kysely<Database>({
  dialect,
});
