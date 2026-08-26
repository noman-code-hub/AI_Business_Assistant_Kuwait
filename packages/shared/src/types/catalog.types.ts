import type { SoftDelete, Timestamps, MoneyKwd } from "./common.types.js";
import type { EntityStatus } from "../constants/statuses.js";

export type ServiceCatalogItem = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    name: string;
    description?: string;
    price: MoneyKwd;
    durationMinutes?: number;
    status: EntityStatus;
  };

export type Product = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    name: string;
    description?: string;
    sku?: string;
    price: MoneyKwd;
    stockQty?: number;
    status: EntityStatus;
  };
