import type { AppointmentStatus } from "../constants/statuses.js";
import type { SoftDelete, Timestamps } from "./common.types.js";

export type Appointment = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    customerId: string;
    staffId?: string;
    serviceId?: string;
    title: string;
    startsAt: string;
    endsAt: string;
    status: AppointmentStatus;
    notes?: string;
  };
