import SQLite from "better-sqlite3";
import type { DB } from "kysely-codegen";
import { Kysely, SqliteDialect } from "kysely";

export const dialect = new SqliteDialect({
  database: new SQLite("db/db.sqlite"),
});

export const db = new Kysely<DB>({
  dialect,
});
