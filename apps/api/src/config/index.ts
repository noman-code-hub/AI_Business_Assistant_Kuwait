import { getEnv } from "./env.js";

export const appConfig = {
  get env() {
    return getEnv();
  },
  get isDev() {
    return getEnv().NODE_ENV !== "production";
  },
  get isLocal() {
    return getEnv().APP_ENV === "local";
  },
};

export { loadEnv, getEnv, envSchema } from "./env.js";
export type { Env } from "./env.js";
