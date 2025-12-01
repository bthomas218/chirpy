const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
process.loadEnvFile();
export const PROFANITIES = ["kerfuffle", "sharbert", "fornax"];
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} is missing from .env file!`);
    }
    return value;
}
const config = {
    fileserverHits: 0,
    platform: envOrThrow("PLATFORM"),
    jwtSecret: envOrThrow("JWT_SECRET"),
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    },
};
export default config;
