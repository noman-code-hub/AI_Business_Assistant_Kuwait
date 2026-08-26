import { Router } from "express";
import { AppError } from "@aba/shared";

/** Placeholder module router until domain implementation. */
export function createStubRouter(resource: string): Router {
  const router = Router();

  router.use((_req, _res, next) => {
    next(AppError.notFound(`${resource} API is scaffolded but not implemented yet`));
  });

  return router;
}
