import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Product = z.infer<typeof ProductSchema>;
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  available: z.boolean(),
});

export const CreateProductSchema = z.object({
  body: z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Product name is required"),
    available: z.boolean().optional().default(true),
  }),
});

export const GetProductSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const SearchProductSchema = z.object({
  query: z.object({
    q: z.string().optional().describe("Search term for product names"),
    sortBy: z
      .enum(["id", "name", "available"])
      .optional()
      .describe("Sorting parameter"),
  }),
});
