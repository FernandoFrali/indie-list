import { Kysely } from "kysely";
import { defineConfig } from "kysely-migrate";
import { dialect } from "./db/database";

export default defineConfig({
  db: new Kysely({
    dialect,
  }),
  migrationFolder: "db/migrations",
  codegen: { dialect: "sqlite", out: "db/types.ts" },
});
