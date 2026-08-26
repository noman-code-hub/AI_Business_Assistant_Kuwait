"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = void 0;
const functions = require("firebase-functions");
/** Phase 1 stub — prefer apps/api for product logic. */
exports.health = functions.https.onRequest((_req, res) => {
  res.status(200).json({ ok: true, service: "aba-functions", phase: 1 });
});
