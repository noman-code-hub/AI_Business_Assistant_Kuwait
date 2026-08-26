import { config as loadDotenv } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./config/env.js";
import { createLogger } from "./lib/logger.js";
import { createApp } from "./app/create-app.js";
import { isFirebaseAdminConfigured } from "./services/firebase/admin.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
loadDotenv({ path: resolve(__dirname, "../.env") });

const env = loadEnv();
const logger = createLogger(env);
const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info("API server listening", {
    port: env.PORT,
    appEnv: env.APP_ENV,
    prefix: env.API_PREFIX,
    firebaseAdmin: isFirebaseAdminConfigured(),
  });
});

function shutdown(signal: string) {
  logger.info("Shutting down", { signal });
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
