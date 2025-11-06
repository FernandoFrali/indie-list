import { sql } from "kysely";

export async function up(db) {
  await db.schema
    .createTable("user")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("email", "varchar", (col) => col.notNull())
    .addColumn("password", "varchar", (col) => col.notNull())
    .addColumn("role", "varchar", (col) => col.notNull().defaultTo("user"))
    .addColumn("avatar", "varchar")
    .addColumn("created_at", "datetime", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "datetime", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema
    .createTable("content")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("description", "varchar")
    .addColumn("thumbnail", "varchar")
    .addColumn("banner", "varchar")
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("slug", "varchar", (col) => col.notNull().unique())
    .addColumn("publisher_id", "text", (col) => col.references("user.id").onDelete("cascade"))
    .addColumn("youtube_url", "varchar")
    .addColumn("netflix_url", "varchar")
    .addColumn("hbo_url", "varchar")
    .addColumn("amazon_url", "varchar")
    .addColumn("disney_url", "varchar")
    .addColumn("other_streaming", "varchar")
    .addColumn("other_streaming_url", "varchar")
    .addColumn("created_at", "datetime", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "datetime", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema
    .createTable("rating")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("content_id", "text", (col) =>
      col.references("content.id").onDelete("cascade").notNull(),
    )
    .addColumn("user_id", "text", (col) => col.references("user.id").onDelete("cascade").notNull())
    .addColumn("stars", "integer", (col) => col.notNull())
    .addColumn("description", "varchar")
    .addColumn("created_at", "datetime", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "datetime", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addUniqueConstraint("unique_user_content_rating", ["user_id", "content_id"])
    .execute();
}

export async function down(db) {
  await db.schema.dropTable("rating").execute();
  await db.schema.dropTable("content").execute();
  await db.schema.dropTable("user").execute();
}
