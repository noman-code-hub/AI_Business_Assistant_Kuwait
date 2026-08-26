import express from "express";
import cors from "cors";
import helmet from "helmet";
import { getEnv } from "../config/env.js";
import {
  requestIdMiddleware,
  rateLimitMiddleware,
  errorHandler,
  notFoundHandler,
} from "../middleware/index.js";
import { registerRoutes } from "./register-routes.js";

export function createApp() {
  const env = getEnv();
  const app = express();

  app.disable("x-powered-by");
  app.use(requestIdMiddleware);
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      credentials: true,
    })
  );
  app.use(rateLimitMiddleware);
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.json({
      name: "AI Business Assistant Kuwait API",
      version: "v1",
      health: `${env.API_PREFIX}/health`,
    });
  });

  app.use(env.API_PREFIX, registerRoutes());
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
