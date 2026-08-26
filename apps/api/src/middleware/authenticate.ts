import type { NextFunction, Request, Response } from "express";
import { AppError } from "@aba/shared";
import { appConfig } from "../config/index.js";
import { getFirebaseAuth, isFirebaseAdminConfigured } from "../services/firebase/admin.js";

/**
 * Verifies Firebase ID tokens via Admin SDK.
 * Local-only fallback: Bearer dev-token (never in production).
 */
export async function authenticateMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const header = req.header("Authorization");
    if (!header) {
      next(AppError.unauthorized());
      return;
    }

    const [scheme, token] = header.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
      next(AppError.unauthorized("Invalid Authorization header"));
      return;
    }

    if (appConfig.isLocal && token === "dev-token") {
      res.locals.user = {
        uid: "dev-user",
        email: "dev@example.com",
        emailVerified: true,
      };
      next();
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      next(
        AppError.unauthorized(
          isFirebaseAdminConfigured()
            ? "Firebase Admin failed to initialize"
            : "Firebase Admin is not configured (set FIREBASE_* env vars)"
        )
      );
      return;
    }

    const decoded = await auth.verifyIdToken(token, true);
    res.locals.user = {
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: Boolean(decoded.email_verified),
    };
    next();
  } catch {
    next(AppError.unauthorized("Invalid or expired token"));
  }
}
