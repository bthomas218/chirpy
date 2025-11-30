import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

process.loadEnvFile();

type APIConfig = {
  fileserverHits: number;
  platform: string;
  jwtSecret: string;
  db: DBconfig;
};

type DBconfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is missing from .env file!`);
  }
  return value;
}

const config: APIConfig = {
  fileserverHits: 0,
  platform: envOrThrow("PLATFORM"),
  jwtSecret: envOrThrow("JWT_SECRET"),
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
};

export default config;
