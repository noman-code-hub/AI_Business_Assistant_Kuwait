import type { ServiceCatalogItem, Product } from "@aba/shared";
import { TenantScopedRepository } from "./tenant-repository.js";

export class ServiceRepository extends TenantScopedRepository<ServiceCatalogItem> {
  protected readonly subcollection = "services" as const;
}

export class ProductRepository extends TenantScopedRepository<Product> {
  protected readonly subcollection = "products" as const;
}

export const serviceRepository = new ServiceRepository();
export const productRepository = new ProductRepository();
