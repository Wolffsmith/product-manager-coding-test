import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  CreateProductSchema,
  GetProductSchema,
  ProductSchema,
} from "./productModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { productController } from "./productController";

export const productRegistry = new OpenAPIRegistry();
export const productRouter: Router = express.Router();

productRegistry.register("Product", ProductSchema);

productRegistry.registerPath({
  method: "get",
  path: "/products",
  tags: ["Product"],
  responses: createApiResponse(z.array(ProductSchema), "Success"),
});

productRouter.get("/", productController.getProducts);

productRegistry.registerPath({
  method: "get",
  path: "/products/{id}",
  tags: ["Product"],
  request: { params: GetProductSchema.shape.params },
  responses: createApiResponse(ProductSchema, "Success"),
});

productRouter.get(
  "/:id",
  validateRequest(GetProductSchema),
  productController.getProduct
);

productRegistry.registerPath({
  method: "post",
  path: "/products",
  tags: ["Product"],
  request: {
    body: {
      content: {
        "application/json": { schema: CreateProductSchema },
      },
    },
  },
  responses: createApiResponse(ProductSchema, "Product created"),
});

productRouter.post(
  "/",
  validateRequest(CreateProductSchema),
  productController.createProduct
);

productRegistry.registerPath({
  method: "delete",
  path: "/products/{id}",
  tags: ["Product"],
  request: { params: GetProductSchema.shape.params },
  responses: createApiResponse(z.null(), "Product deleted", 204),
});

productRouter.delete(
  "/:id",
  validateRequest(GetProductSchema),
  productController.deleteProduct
);
