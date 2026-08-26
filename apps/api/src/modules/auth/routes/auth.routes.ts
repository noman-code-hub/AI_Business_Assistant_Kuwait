import { Router } from "express";
import { asyncHandler } from "../../../lib/async-handler.js";
import { authenticateMiddleware } from "../../../middleware/authenticate.js";
import { getMe } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.get(
  "/me",
  asyncHandler(authenticateMiddleware),
  asyncHandler(async (req, res) => {
    getMe(req, res);
  })
);
