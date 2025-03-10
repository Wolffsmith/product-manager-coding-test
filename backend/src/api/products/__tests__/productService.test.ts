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
      expect(result.message).toEqual("No products found");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findAllAsync", async () => {
      // Arrange
      (productRepositoryInstance.findAllAsync as Mock).mockImplementation(
        () => {
          throw new Error("An error occurred while retrieving products.");
        }
      );

      // Act
      const result = await productServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual(
        "An error occurred while retrieving products."
      );
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
          throw new Error("An error occurred while finding product.");
        }
      );

      // Act
      const result = await productServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual(
        "An error occurred while finding product."
      );
      expect(result.responseObject).toBe;
    });
  });

  describe("search", () => {
    it("returns products for a valid query", async () => {
      // Arrange
      const query = "Product";
      const mockSearchResults = mockProducts;
      (productRepositoryInstance.searchAsync as Mock).mockReturnValue(
        mockSearchResults
      );

      // Act
      const result = await productServiceInstance.search(query);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Products found");
      expect(result.responseObject).toEqual(mockSearchResults);
    });

    it("returns a not found error for no products matching the query", async () => {
      // Arrange
      const query = "NonExistentProduct";
      (productRepositoryInstance.searchAsync as Mock).mockReturnValue([]);

      // Act
      const result = await productServiceInstance.search(query);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("No products found");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for searchAsync", async () => {
      // Arrange
      const query = "Product";
      (productRepositoryInstance.searchAsync as Mock).mockImplementation(() => {
        throw new Error("An error occurred while searching for products.");
      });

      // Act
      const result = await productServiceInstance.search(query);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual(
        "An error occurred while searching for products."
      );
      expect(result.responseObject).toBeNull();
    });
  });

  describe("create", () => {
    it("creates a new product", async () => {
      // Arrange
      const newProduct: Product = {
        id: 3,
        name: "Product 3",
        available: true,
      };
      (productRepositoryInstance.createAsync as Mock).mockReturnValue(
        newProduct
      );

      // Act
      const result = await productServiceInstance.create(newProduct);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Product created");
      expect(result.responseObject).toEqual(newProduct);
    });

    it("handles errors for createAsync", async () => {
      // Arrange
      const newProduct: Product = {
        id: 3,
        name: "Product 3",
        available: true,
      };
      (productRepositoryInstance.createAsync as Mock).mockImplementation(() => {
        throw new Error("An error occurred while creating product.");
      });

      // Act
      const result = await productServiceInstance.create(newProduct);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual(
        "An error occurred while creating product."
      );
      expect(result.responseObject).toBeNull();
    });
  });

  describe("delete", () => {
    it("deletes a product for a valid ID", async () => {
      // Arrange
      const testId = 2;
      (productRepositoryInstance.findByIdAsync as Mock).mockReturnValue(
        mockProducts[1]
      );
      (productRepositoryInstance.deleteAsync as Mock).mockReturnValue(
        mockProducts[1]
      );

      // Act
      const result = await productServiceInstance.delete(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Product deleted");
      expect(result.responseObject).toEqual({
        id: 2,
        name: "Product 2",
        available: false,
      });
    });

    it("returns Product is available, cannot delete", async () => {
      // Arrange
      const testId = 1;
      (productRepositoryInstance.findByIdAsync as Mock).mockReturnValue(
        mockProducts[0]
      );
      (productRepositoryInstance.deleteAsync as Mock).mockReturnValue(
        mockProducts[0]
      );

      // Act
      const result = await productServiceInstance.delete(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("Product is available, cannot delete");
      expect(result.responseObject).toBeNull();
    });
  });
});
