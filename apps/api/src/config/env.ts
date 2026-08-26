import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ENV: z.enum(["local", "development", "staging", "production"]).default("local"),
  PORT: z.coerce.number().int().min(1).max(65535).default(8080),
  API_PREFIX: z.string().default("/api/v1"),
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:5173")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    ),

  FIREBASE_PROJECT_ID: z.preprocess(emptyToUndefined, z.string().optional()),
  FIREBASE_CLIENT_EMAIL: z.preprocess(emptyToUndefined, z.string().email().optional()),
  FIREBASE_PRIVATE_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  FIREBASE_STORAGE_BUCKET: z.preprocess(emptyToUndefined, z.string().optional()),

  OPENAI_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  OPENAI_MAX_TOKENS: z.coerce.number().int().positive().default(2048),

  WHATSAPP_TOKEN: z.preprocess(emptyToUndefined, z.string().optional()),
  WHATSAPP_PHONE_NUMBER_ID: z.preprocess(emptyToUndefined, z.string().optional()),
  WHATSAPP_BUSINESS_ACCOUNT_ID: z.preprocess(emptyToUndefined, z.string().optional()),
  WHATSAPP_VERIFY_TOKEN: z.preprocess(emptyToUndefined, z.string().optional()),
  WHATSAPP_APP_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),

  GOOGLE_CALENDAR_CLIENT_ID: z.preprocess(emptyToUndefined, z.string().optional()),
  GOOGLE_CALENDAR_CLIENT_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),
  GOOGLE_CALENDAR_REDIRECT_URI: z.preprocess(emptyToUndefined, z.string().url().optional()),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
  JWT_CLOCK_SKEW_SECONDS: z.coerce.number().int().nonnegative().default(60),

  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${details}`);
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}

export function getEnv(): Env {
  if (!cachedEnv) {
    return loadEnv();
  }
  return cachedEnv;
}
