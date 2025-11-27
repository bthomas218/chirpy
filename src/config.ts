process.loadEnvFile();

type APIConfig = {
  fileserverHits: number;
  dbURL: string;
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
  dbURL: envOrThrow("DB_URL"),
};

export default config;
