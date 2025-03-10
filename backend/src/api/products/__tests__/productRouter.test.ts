import { StatusCodes } from "http-status-codes";
import request from "supertest";

import { Product } from "../productModel";
import { products } from "../productRepository";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";

describe("Product API Endpoints", () => {
  describe("GET /products", () => {
    it("should return a list of products", async () => {
      // Act
      const response = await request(app).get("/products");
      const responseBody: ServiceResponse<Product[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Products found");
      expect(responseBody.responseObject.length).toEqual(products.length);
      responseBody.responseObject.forEach((product, index) =>
        compareProducts(products[index] as Product, product)
      );
    });
  });
  describe("GET /products/:id", () => {
    it("should return a product for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const expectedProduct = products.find(
        (product) => product.id === testId
      ) as Product;

      // Act
      const response = await request(app).get(`/products/${testId}`);
      const responseBody: ServiceResponse<Product> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Product found");
      if (!expectedProduct)
        throw new Error("Invalid test data: expectedProduct is undefined");
      compareProducts(expectedProduct, responseBody.responseObject);
    });

    it("should return a not found error for non-existent ID", async () => {
      // Arrange
      const testId = Number.MAX_SAFE_INTEGER;

      // Act
      const response = await request(app).get(`/products/${testId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Product not found");
      expect(responseBody.responseObject).toBeNull();
    });

    it("should return a bad request for invalid ID format", async () => {
      // Act
      const invalidInput = "abc";
      const response = await request(app).get(`/products/${invalidInput}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Invalid ID format");
      expect(responseBody.responseObject).toBeNull();
    });
  });
});

function compareProducts(expected: Product, actual: Product) {
  expect(actual.id).toEqual(expected.id);
  expect(actual.name).toEqual(expected.name);
  expect(actual.available).toEqual(expected.available);
}
