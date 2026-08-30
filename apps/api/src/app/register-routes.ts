import { Router } from "express";
import { healthRouter } from "../modules/health/routes/health.routes.js";
import { authRouter } from "../modules/auth/routes/auth.routes.js";
import { tenantsRouter } from "../modules/tenants/routes/tenants.routes.js";
import { customersRouter } from "../modules/customers/routes/customers.routes.js";
import { servicesRouter } from "../modules/services-catalog/routes/services.routes.js";
import { membershipsRouter } from "../modules/memberships/routes/memberships.routes.js";
import { dashboardRouter } from "../modules/dashboard/routes/dashboard.routes.js";
import { createStubRouter } from "./create-stub-router.js";

export function registerRoutes(): Router {
  const api = Router();

  api.use("/health", healthRouter);
  api.use("/auth", authRouter);
  api.use("/tenants", tenantsRouter);
  api.use("/dashboard", dashboardRouter);
  api.use("/customers", customersRouter);
  api.use("/services", servicesRouter);
  api.use("/memberships", membershipsRouter);

  api.use("/users", createStubRouter("users"));
  api.use("/appointments", createStubRouter("appointments"));
  api.use("/bookings", createStubRouter("bookings"));
  api.use("/inbox", createStubRouter("inbox"));
  api.use("/whatsapp", createStubRouter("whatsapp"));
  api.use("/ai", createStubRouter("ai"));
  api.use("/calendar", createStubRouter("calendar"));
  api.use("/invoices", createStubRouter("invoices"));
  api.use("/inventory", createStubRouter("inventory"));
  api.use("/staff", createStubRouter("staff"));
  api.use("/properties", createStubRouter("properties"));
  api.use("/vehicles", createStubRouter("vehicles"));
  api.use("/events", createStubRouter("events"));
  api.use("/menu", createStubRouter("menu"));
  api.use("/reports", createStubRouter("reports"));
  api.use("/billing", createStubRouter("billing"));
  api.use("/storage", createStubRouter("storage"));
  api.use("/webhooks", createStubRouter("webhooks"));

  return api;
}
