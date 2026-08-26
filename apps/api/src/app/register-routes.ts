import { Router } from "express";
import { healthRouter } from "../modules/health/routes/health.routes.js";
import { authRouter } from "../modules/auth/routes/auth.routes.js";
import { createStubRouter } from "./create-stub-router.js";

export function registerRoutes(): Router {
  const api = Router();

  api.use("/health", healthRouter);
  api.use("/auth", authRouter);

  api.use("/tenants", createStubRouter("tenants"));
  api.use("/users", createStubRouter("users"));
  api.use("/customers", createStubRouter("customers"));
  api.use("/appointments", createStubRouter("appointments"));
  api.use("/bookings", createStubRouter("bookings"));
  api.use("/inbox", createStubRouter("inbox"));
  api.use("/whatsapp", createStubRouter("whatsapp"));
  api.use("/ai", createStubRouter("ai"));
  api.use("/calendar", createStubRouter("calendar"));
  api.use("/invoices", createStubRouter("invoices"));
  api.use("/inventory", createStubRouter("inventory"));
  api.use("/staff", createStubRouter("staff"));
  api.use("/services", createStubRouter("services"));
  api.use("/properties", createStubRouter("properties"));
  api.use("/vehicles", createStubRouter("vehicles"));
  api.use("/events", createStubRouter("events"));
  api.use("/memberships", createStubRouter("memberships"));
  api.use("/menu", createStubRouter("menu"));
  api.use("/reports", createStubRouter("reports"));
  api.use("/billing", createStubRouter("billing"));
  api.use("/storage", createStubRouter("storage"));
  api.use("/webhooks", createStubRouter("webhooks"));

  return api;
}
