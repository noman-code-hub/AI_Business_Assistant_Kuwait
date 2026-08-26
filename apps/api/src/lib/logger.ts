import type { Env } from "../config/env.js";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = Record<string, unknown>;

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function shouldLog(configured: LogLevel, level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[configured];
}

function write(level: LogLevel, message: string, context?: LogContext): void {
  const entry = {
    level,
    message,
    time: new Date().toISOString(),
    ...context,
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }
  // eslint-disable-next-line no-console -- structured logger sink
  console.log(line);
}

export function createLogger(env: Pick<Env, "LOG_LEVEL" | "APP_ENV">) {
  const log = (level: LogLevel, message: string, context?: LogContext) => {
    if (!shouldLog(env.LOG_LEVEL, level)) return;
    write(level, message, { appEnv: env.APP_ENV, ...context });
  };

  return {
    debug: (message: string, context?: LogContext) => log("debug", message, context),
    info: (message: string, context?: LogContext) => log("info", message, context),
    warn: (message: string, context?: LogContext) => log("warn", message, context),
    error: (message: string, context?: LogContext) => log("error", message, context),
    child: (base: LogContext) => ({
      debug: (message: string, context?: LogContext) =>
        log("debug", message, { ...base, ...context }),
      info: (message: string, context?: LogContext) => log("info", message, { ...base, ...context }),
      warn: (message: string, context?: LogContext) => log("warn", message, { ...base, ...context }),
      error: (message: string, context?: LogContext) =>
        log("error", message, { ...base, ...context }),
    }),
  };
}

export type Logger = ReturnType<typeof createLogger>;
