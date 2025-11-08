import { sql } from "kysely";

export async function up(db) {
  await db.schema
    .createTable("user")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("emailVerified", "boolean")
    .addColumn("role", "text", (col) => col.notNull().defaultTo("user"))
    .addColumn("image", "text")
    .addColumn("createdAt", "date", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "date", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema
    .createTable("content")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("description", "text")
    .addColumn("thumbnail", "text")
    .addColumn("banner", "text")
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull().unique())
    .addColumn("publisherId", "text", (col) => col.references("user.id").onDelete("cascade"))
    .addColumn("youtubeUrl", "text")
    .addColumn("netflixUrl", "text")
    .addColumn("hboUrl", "text")
    .addColumn("amazonUrl", "text")
    .addColumn("disneyUrl", "text")
    .addColumn("otherStreaming", "text")
    .addColumn("otherStreamingUrl", "text")
    .addColumn("createdAt", "date", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "date", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema
    .createTable("rating")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("contentSlug", "text", (col) =>
      col.references("content.slug").onDelete("cascade").notNull(),
    )
    .addColumn("userId", "text", (col) => col.references("user.id").onDelete("cascade").notNull())
    .addColumn("stars", "integer", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("createdAt", "date", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "date", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addUniqueConstraint("unique_user_content_rating", ["userId", "contentSlug"])
    .execute();

  await db.schema
    .createTable("session")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("expiresAt", "date", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.notNull().unique())
    .addColumn("createdAt", "date", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "date", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("ipAddress", "text")
    .addColumn("userAgent", "text")
    .addColumn("userId", "text", (col) => col.references("user.id").onDelete("cascade").notNull())
    .execute();

  await db.schema
    .createTable("account")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("accountId", "text", (col) => col.notNull())
    .addColumn("providerId", "text", (col) => col.notNull())
    .addColumn("userId", "text", (col) => col.references("user.id").onDelete("cascade").notNull())
    .addColumn("accessToken", "text")
    .addColumn("refreshToken", "text")
    .addColumn("idToken", "text")
    .addColumn("accessTokenExpiresAt", "date")
    .addColumn("refreshTokenExpiresAt", "date")
    .addColumn("scope", "text")
    .addColumn("password", "text")
    .addColumn("createdAt", "date", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "date", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addUniqueConstraint("account_provider_account_unique", ["providerId", "accountId"])
    .execute();

  await db.schema
    .createTable("verification")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("value", "text", (col) => col.notNull())
    .addColumn("expiresAt", "date", (col) => col.notNull())
    .addColumn("createdAt", "date", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "date", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db) {
  await db.schema.dropTable("rating").execute();
  await db.schema.dropTable("content").execute();
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("session").execute();
  await db.schema.dropTable("account").execute();
  await db.schema.dropTable("verification").execute();
}
