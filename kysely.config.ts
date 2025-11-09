import { defineConfig } from "kysely-ctl";
import { db } from "./db/database";

export default defineConfig({
  kysely: db,
  migrations: {
    migrationFolder: "db/migrations",
  },
});
