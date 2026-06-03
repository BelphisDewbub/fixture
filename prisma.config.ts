import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env.local so Prisma CLI picks up the database URL
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Unpooled direct connection required for migrations (no pgbouncer)
    url: process.env["DATABASE_URL_UNPOOLED"],
  },
});
