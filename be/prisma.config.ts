import { defineConfig, env } from "prisma/config";
import { configDotenv } from "dotenv";

configDotenv();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
