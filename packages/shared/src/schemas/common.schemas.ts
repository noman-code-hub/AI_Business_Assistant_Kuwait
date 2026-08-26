import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "../constants/limits.js";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().trim().max(200).optional(),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const kuwaitPhoneSchema = z
  .string()
  .regex(/^\+965[0-9]{8}$/, "Must be E.164 Kuwait number (+965########)");

export const moneyKwdSchema = z.object({
  amount: z.number().finite(),
  currency: z.literal("KWD"),
});
