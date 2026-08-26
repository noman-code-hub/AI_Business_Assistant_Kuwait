import * as functions from "firebase-functions";

/**
 * Phase 1: Functions codebase is configured but empty of product logic.
 * Express (`apps/api`) is the primary trusted server.
 */
export const health = functions.https.onRequest((_req, res) => {
  res.status(200).json({ ok: true, service: "aba-functions", phase: 1 });
});
