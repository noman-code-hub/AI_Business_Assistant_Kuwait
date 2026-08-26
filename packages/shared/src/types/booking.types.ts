import type { Timestamps } from "./common.types.js";

export type Booking = Timestamps & {
  id: string;
  tenantId: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  serviceId?: string;
  startsAt: string;
  endsAt: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  source: "web" | "whatsapp" | "walk_in" | "phone";
};
