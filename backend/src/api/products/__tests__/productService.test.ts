import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import type { Product } from "@/api/products/productModel";
import { ProductRepository } from "@/api/products/productRepository";
import { ProductService } from "@/api/products/productService";

vi.mock("@/api/products/productRepository");

describe("productService", () => {
  let productServiceInstance: ProductService;
  let productRepositoryInstance: ProductRepository;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Product 1",
      available: true,
    },
    {
      id: 2,
      name: "Product 2",
      available: false,
    },
  ];

  beforeEach(() => {
    productRepositoryInstance = new ProductRepository();
    productServiceInstance = new ProductService(productRepositoryInstance);
  });

  describe("findAll", () => {
    it("return all products", async () => {
      // Arrange
      (productRepositoryInstance.findAllAsync as Mock).mockReturnValue(
        mockProducts
      );

      // Act
      const result = await productServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Products found");
      expect(result.responseObject).toEqual(mockProducts);
    });

    it("returns a not found error for no products found", async () => {
      // Arrange
      (productRepositoryInstance.findAllAsync as Mock).mockReturnValue(null);

      // Act
      const result = await productServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("Products not found");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findAllAsync", async () => {
      // Arrange
      (productRepositoryInstance.findAllAsync as Mock).mockImplementation(
        () => {
          throw new Error("Test error");
        }
      );

      // Act
      const result = await productServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("Test error");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findById", () => {
    it("returns a product for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const mockProduct = mockProducts.find((product) => product.id === testId);
      (productRepositoryInstance.findByIdAsync as Mock).mockReturnValue(
        mockProduct
      );

      // Act
      const result = await productServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Product found");
      expect(result.responseObject).toEqual(mockProduct);
    });

    it("returns a not found error for non-existent ID", async () => {
      // Arrange
      const testId = Number.MAX_SAFE_INTEGER;
      (productRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await productServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("Product not found");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findByIdAsync", async () => {
      // Arrange
      const testId = 1;
      (productRepositoryInstance.findByIdAsync as Mock).mockImplementation(
        () => {
          throw new Error("Test error");
        }
      );

      // Act
      const result = await productServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("Test error");
      expect(result.responseObject).toBe;
    });
  });
});
