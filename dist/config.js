process.loadEnvFile();
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} is missing from .env file!`);
    }
    return value;
}
const config = {
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL"),
};
export default config;
