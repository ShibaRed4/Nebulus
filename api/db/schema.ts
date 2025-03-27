import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const movies = sqliteTable("movies", {
  id: integer("id").primaryKey(),
  title: text("name"),
  releaseYear: integer("release_year"),
});

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username')
})